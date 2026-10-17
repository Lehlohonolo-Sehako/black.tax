"use client";
import dynamic from "next/dynamic";

// The app measures the window to pick its mobile / tablet / desktop layout, so render it on the client only.
const App = dynamic(() => import("../screens/App"), { ssr: false });

export default function Page() {
  return <App />;
}
