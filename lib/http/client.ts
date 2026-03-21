export type ApiError = {
  status: number
  message: string
  details?: unknown
}

type Query = Record<string, string | number | boolean | undefined | null>

type RequestOptions = {
  headers?: Record<string, string>
  query?: Query
  signal?: AbortSignal
  cache?: RequestCache
  credentials?: RequestCredentials
  mode?: RequestMode
  redirect?: RequestRedirect
  referrer?: string
  referrerPolicy?: ReferrerPolicy
  integrity?: string
  keepalive?: boolean
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

function buildQuery(query?: Query) {
  if (!query) return ""
  const params = new URLSearchParams()
  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    params.append(k, String(v))
  })
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

function buildUrl(path: string, query?: Query) {
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}${buildQuery(query)}`
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T
  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  if (!res.ok) {
    let message = res.statusText || "Request failed"
    let details: unknown = undefined
    if (isJson) {
      try {
        const data = await res.json()
        message = (data && (data.message || data.error)) ?? message
        details = data
      } catch {}
    } else {
      try {
        const text = await res.text()
        message = text || message
      } catch {}
    }
    const err: ApiError = { status: res.status, message, details }
    throw err
  }
  if (isJson) {
    return (await res.json()) as T
  }
  return (await res.text()) as unknown as T
}

function mergeHeaders(init?: HeadersInit, extra?: Record<string, string>): Headers {
  const headers = new Headers(init)
  Object.entries(extra ?? {}).forEach(([k, v]) => {
    headers.set(k, v)
  })
  return headers
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> {
  const url = buildUrl(path, options?.query)
  const headers = mergeHeaders(options?.headers, {
    Accept: "application/json",
    "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json",
  })
  const init: RequestInit = {
    method,
    headers,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    signal: options?.signal,
    cache: options?.cache,
    credentials: options?.credentials,
    mode: options?.mode,
    redirect: options?.redirect,
    referrer: options?.referrer,
    referrerPolicy: options?.referrerPolicy,
    integrity: options?.integrity,
    keepalive: options?.keepalive,
  }
  if (body instanceof FormData) {
    headers.delete("Content-Type")
  }
  const res = await fetch(url, init)
  return handleResponse<T>(res)
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, undefined, options),
}

