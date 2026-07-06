/*
  DOSYA: invoiceService.js

  Faturalar sayfası ile veri kaynağı arasındaki bağlantı katmanıdır.
  Componentler doğrudan fetch çağrısı yapmaz.

  VITE_API_URL boşsa mockInvoiceData kullanılır.
  VITE_API_URL doluysa GET /invoices isteği yapılır.
*/

import { mockInvoices } from "../data/mockInvoiceData";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const MOCK_DELAY_MS = 350;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneInvoices(invoices) {
  return invoices.map((invoice) => ({ ...invoice }));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? `Fatura isteği başarısız oldu (${response.status}).`);
  }

  return response.json();
}

export async function getInvoices() {
  if (API_URL) {
    return apiRequest("/invoices");
  }

  await wait();
  return cloneInvoices(mockInvoices);
}
