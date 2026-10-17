"""Convert the Claude Design `.dc.html` template into a JSX render function.

Usage: python3 -I convert.py <template.html> <out_view.jsx> <out_hover.css>
The template must be the markup inside <x-dc> without the <helmet> and <script> blocks.
"""
import re
import sys
from html.parser import HTMLParser

VOID = {"input", "br", "img", "meta", "link", "hr"}
ATTR_MAP = {
    "onclick": "onClick", "onchange": "onChange", "oninput": "onInput", "onkeydown": "onKeyDown",
    "viewbox": "viewBox", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin", "stroke-dasharray": "strokeDasharray", "fill-rule": "fillRule",
    "clip-rule": "clipRule", "inputmode": "inputMode", "autocomplete": "autoComplete",
    "maxlength": "maxLength", "class": "className", "for": "htmlFor", "tabindex": "tabIndex",
    "readonly": "readOnly", "colspan": "colSpan", "rowspan": "rowSpan",
}
PSEUDO = {"style-hover": "hover", "style-focus": "focus", "style-active": "active"}
EXPR = re.compile(r"\{\{\s*([^}]+?)\s*\}\}")


def roots(expr, scope, used):
    root = expr.split(".")[0].strip()
    if root not in scope and root not in ("true", "false", "null"):
        used.add(root)


def js_str(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ") + "'"


def value_expr(raw, scope, used):
    """Attribute value -> JS expression string."""
    m = EXPR.fullmatch(raw.strip())
    if m:
        roots(m.group(1), scope, used)
        return m.group(1)
    if EXPR.search(raw):
        def rep(mm):
            roots(mm.group(1), scope, used)
            return "${" + mm.group(1) + "}"
        body = EXPR.sub(rep, raw.replace("`", "\\`"))
        return "`" + body + "`"
    return None


def camel(prop):
    if prop.startswith("--"):
        return js_str(prop)
    if prop.startswith("-webkit-"):
        prop = "Webkit-" + prop[len("-webkit-"):]
    parts = prop.split("-")
    return parts[0] + "".join(p[:1].upper() + p[1:] for p in parts[1:])


def split_decls(css):
    out, depth, cur = [], 0, ""
    for ch in css:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch == ";" and depth == 0:
            out.append(cur)
            cur = ""
        else:
            cur += ch
    out.append(cur)
    return [d.strip() for d in out if d.strip()]


def style_obj(css, scope, used):
    items = []
    for decl in split_decls(css):
        if ":" not in decl:
            continue
        prop, val = decl.split(":", 1)
        prop, val = prop.strip(), val.strip()
        ve = value_expr(val, scope, used)
        items.append(f"{camel(prop)}: {ve if ve is not None else js_str(val)}")
    return "{{" + ", ".join(items) + "}}"


class Conv(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.out = []
        self.stack = []  # (tag, kind)
        self.scopes = [set()]
        self.used = set()
        self.pseudo = {}
        self.loop = 0

    @property
    def scope(self):
        s = set()
        for x in self.scopes:
            s |= x
        return s

    def pseudo_class(self, kind, css):
        key = (kind, css)
        if key not in self.pseudo:
            self.pseudo[key] = f"dc-{kind[0]}{len(self.pseudo)}"
        return self.pseudo[key]

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "sc-if":
            cond = value_expr(a["value"], self.scope, self.used)
            self.out.append("{(" + cond + ") ? (<>")
            self.stack.append((tag, None))
            return
        if tag == "sc-for":
            lst = value_expr(a["list"], self.scope, self.used)
            var = a["as"]
            idx = f"__i{self.loop}"
            self.loop += 1
            self.scopes.append({var, idx})
            self.out.append(f"{{({lst}).map(({var}, {idx}) => (<React.Fragment key={{{idx}}}>")
            self.stack.append((tag, None))
            return
        parts, classes = [], []
        for name, val in attrs:
            if name.startswith("hint-"):
                continue
            if name in PSEUDO:
                classes.append(self.pseudo_class(PSEUDO[name], val))
                continue
            if name == "style":
                parts.append(f"style={style_obj(val or '', self.scope, self.used)}")
                continue
            jname = ATTR_MAP.get(name, name)
            if val is None:
                parts.append(jname)
                continue
            ve = value_expr(val, self.scope, self.used)
            if ve is not None:
                parts.append(f"{jname}={{{ve}}}")
            else:
                parts.append(f"{jname}={js_str(val)}" if "'" not in val and "\\" not in val else f"{jname}={{{js_str(val)}}}")
        if classes:
            parts.append(f'className="{" ".join(classes)}"')
        attr_s = (" " + " ".join(parts)) if parts else ""
        if tag in VOID:
            self.out.append(f"<{tag}{attr_s} />")
        else:
            self.out.append(f"<{tag}{attr_s}>")
            self.stack.append((tag, None))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and tag not in ("sc-if", "sc-for"):
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        t, _ = self.stack.pop()
        assert t == tag, (t, tag, self.getpos())
        if tag == "sc-if":
            self.out.append("</>) : null}")
        elif tag == "sc-for":
            self.scopes.pop()
            self.out.append("</React.Fragment>))}")
        else:
            self.out.append(f"</{tag}>")

    def handle_data(self, data):
        if not data:
            return
        pos = 0
        res = ""
        for m in EXPR.finditer(data):
            res += self.text(data[pos:m.start()])
            roots(m.group(1), self.scope, self.used)
            res += "{" + m.group(1) + "}"
            pos = m.end()
        res += self.text(data[pos:])
        self.out.append(res)

    def text(self, s):
        if any(c in s for c in "<>{}"):
            return "".join("{" + js_str(c) + "}" if c in "<>{}" else c for c in s)
        return s

    def handle_entityref(self, name):
        self.out.append(f"&{name};")

    def handle_charref(self, name):
        self.out.append(f"&#{name};")

    def handle_comment(self, data):
        pass


def main():
    src, out_jsx, out_css = sys.argv[1:4]
    html = open(src, encoding="utf-8").read()
    c = Conv()
    c.feed(html)
    c.close()
    assert not c.stack, c.stack
    body = "".join(c.out)
    names = sorted(c.used)
    jsx = (
        "// Generated from design/black.tax App.dc.html by design/convert.py. Do not edit by hand.\n"
        "import React from 'react';\n\n"
        "export default function View(v) {\n"
        f"  const {{ {', '.join(names)} }} = v;\n"
        f"  return (<>{body}</>);\n"
        "}\n"
    )
    open(out_jsx, "w", encoding="utf-8").write(jsx)
    css = []
    for (kind, decls), cls in c.pseudo.items():
        sel = f".{cls}:{'focus-visible' if kind == 'focus' else kind}"
        if kind == "focus":
            sel = f".{cls}:focus"
        rules = ";".join(d + " !important" for d in split_decls(decls))
        css.append(f"{sel}{{{rules}}}")
    open(out_css, "w", encoding="utf-8").write("/* Generated by design/convert.py */\n" + "\n".join(css) + "\n")
    print("identifiers:", " ".join(names))


if __name__ == "__main__":
    main()
