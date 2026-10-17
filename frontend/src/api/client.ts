/**
 * Typed client for the core API. Types are generated from api/core.yaml (`npm run generate`), so a contract
 * change that breaks the web app fails the type check rather than the demo.
 */
import createClient, { type Middleware } from 'openapi-fetch';
import type { components, paths } from './generated';

export type Schemas = components['schemas'];
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';
const TOKEN_KEY = 'blacktax.token';

export const session = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string | null) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* private mode: the session lasts until reload */
    }
  },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const auth: Middleware = {
  onRequest({ request }) {
    const t = session.get();
    if (t) request.headers.set('Authorization', `Bearer ${t}`);
    return request;
  },
};

export const api = createClient<paths>({ baseUrl: API_URL });
api.use(auth);

/** Unwrap an openapi-fetch result: data, or an ApiError carrying the server's plain-language detail. */
export async function call<T>(p: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  const { data, error, response } = await p;
  if (!response.ok) {
    const e = error as { detail?: string; title?: string } | undefined;
    throw new ApiError(response.status, e?.detail ?? e?.title ?? `Request failed (${response.status})`);
  }
  return data as T;
}
