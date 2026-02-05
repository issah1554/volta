export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000/volta/api";

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = buildUrl(path);
  const headers = {
    ...DEFAULT_HEADERS,
    ...(init.headers ?? {}),
  };

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  let payload: unknown = null;

  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message?: unknown }).message === "string"
        ? String((payload as { message?: unknown }).message)
        : response.statusText || "Request failed";

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
