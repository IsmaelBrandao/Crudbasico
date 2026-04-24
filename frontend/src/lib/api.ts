export type DataSource = "api" | "local";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ?? "";
}

export function isApiConfigured() {
  return Boolean(getApiBaseUrl());
}

export async function fetchApiJson<T>(path: string) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new Error("API_NOT_CONFIGURED");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API_REQUEST_FAILED_${response.status}`);
  }

  return (await response.json()) as T;
}
