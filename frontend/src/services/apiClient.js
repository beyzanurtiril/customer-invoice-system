/*
  DOSYA: apiClient.js

  Frontend'in ortak HTTP katmanıdır.
  Service dosyaları doğrudan fetch detayını tekrar etmez; burada toplanır.

  .env içindeki VITE_API_URL şu şekilde olmalı:
  VITE_API_URL=http://localhost:8080/api

  Böylece apiRequest("/customers") çağrısı şu adrese gider:
  http://localhost:8080/api/customers
*/
const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");


export function isApiEnabled() {
  return Boolean(API_URL);
}

export async function apiRequest(path, options = {}) {
  const { headers, ...restOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? `İstek başarısız oldu (${response.status}).`);
  }

  if (response.status === 204) return null;

  return response.json();
}

export async function optionalApiRequest(path, fallbackValue = null, options = {}) {
  try {
    return await apiRequest(path, options);
  } catch {
    return fallbackValue;
  }
}

export function getListFromResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;

  return [];
}
