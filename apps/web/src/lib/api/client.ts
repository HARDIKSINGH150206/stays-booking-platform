import type { ApiFailure, ApiErrorPayload } from "@/lib/types";

export class ApiError extends Error implements ApiFailure {
  status?: number;

  code: string;

  details?: ApiErrorPayload["details"];

  raw?: unknown;

  constructor({
    message,
    status,
    code,
    details,
    raw,
  }: ApiFailure) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.raw = raw;
  }
}

export class ApiUnavailableError extends ApiError {
  constructor() {
    super({
      message:
        "The STAYS backend API is not configured yet. Connect NEXT_PUBLIC_API_BASE_URL to enable live data.",
      code: "api_unavailable",
    });
    this.name = "ApiUnavailableError";
  }
}

function getBaseUrl(): string | null {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    null;

  if (!rawBaseUrl) {
    return null;
  }

  return rawBaseUrl.replace(/\/$/, "");
}

function resolveUrl(path: string): string {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new ApiUnavailableError();
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return response.text();
  }

  return response.json();
}

function extractApiMessage(payload: unknown, fallback: string): ApiFailure {
  if (payload && typeof payload === "object") {
    const body = payload as ApiErrorPayload & { statusCode?: number };
    const message =
      body.message ??
      body.error ??
      fallback;
    return {
      message,
      status: body.statusCode,
      code: body.code ?? "request_failed",
      details: body.details,
      raw: payload,
    };
  }

  return {
    message: fallback,
    code: "request_failed",
    raw: payload,
  };
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(resolveUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : null),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = await parseResponseBody(response).catch(() => null);

  if (!response.ok) {
    throw new ApiError({
      ...extractApiMessage(payload, `Request failed with status ${response.status}`),
      status: response.status,
      raw: payload,
    });
  }

  return payload as T;
}

export function isApiUnavailableError(error: unknown): boolean {
  return error instanceof ApiUnavailableError || (error instanceof ApiError && error.code === "api_unavailable");
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}
