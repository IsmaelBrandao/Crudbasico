export type DataSource = "api" | "local";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ?? "";
}

export function isApiConfigured() {
  return Boolean(getApiBaseUrl());
}

export async function fetchApiJson<T>(path: string) {
  return requestApi<T>(path);
}

export async function postApiJson<TResponse, TBody>(path: string, body: TBody) {
  return requestApi<TResponse>(path, {
    body,
    method: "POST",
  });
}

export async function putApiJson<TResponse, TBody>(path: string, body: TBody) {
  return requestApi<TResponse>(path, {
    body,
    method: "PUT",
  });
}

export async function deleteApi(path: string) {
  await requestApi<void>(path, {
    method: "DELETE",
  });
}

async function requestApi<T>(
  path: string,
  options: {
    body?: unknown;
    method?: "DELETE" | "GET" | "POST" | "PUT";
  } = {},
) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new Error("API_NOT_CONFIGURED");
  }

  const method = options.method || "GET";
  const hasBody = options.body !== undefined;
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
    method,
  });

  if (!response.ok) {
    let message = `API_REQUEST_FAILED_${response.status}`;

    try {
      const errorPayload = (await response.json()) as { mensagem?: string };

      if (errorPayload?.mensagem) {
        message = errorPayload.mensagem;
      }
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
