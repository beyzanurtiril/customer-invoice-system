import { initialCustomers } from "../data/mockData";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const MOCK_DELAY_MS = 350;

let mockCustomers = initialCustomers.map((customer) => ({ ...customer }));

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneCustomer(customer) {
  return customer ? { ...customer } : customer;
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
    throw new Error(payload?.message ?? `İstek başarısız oldu (${response.status}).`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function nextMockId() {
  const ids = mockCustomers.map((customer) => Number(customer.id)).filter(Number.isFinite);
  return String((ids.length ? Math.max(...ids) : 1000) + 1);
}

export async function getCustomers() {
  if (API_URL) return apiRequest("/customers");

  await wait();
  return mockCustomers.map(cloneCustomer);
}

export async function createCustomer(input) {
  if (API_URL) {
    return apiRequest("/customers", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  await wait();
  const customer = {
    ...input,
    id: nextMockId(),
    tag: input.tag ?? (input.lineType === "Faturasız" ? "Aktif" : "Güvenilir"),
    lastInvoice: input.lastInvoice ?? "—",
    status: input.status ?? "Yeni kayıt",
    statusTone: input.statusTone ?? "success",
  };

  mockCustomers = [customer, ...mockCustomers];
  return cloneCustomer(customer);
}

export async function updateCustomer(id, input) {
  if (API_URL) {
    return apiRequest(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  await wait();
  const current = mockCustomers.find((customer) => customer.id === id);
  if (!current) throw new Error("Güncellenecek müşteri bulunamadı.");

  const updatedCustomer = {
    ...current,
    ...input,
    id: current.id,
    phone: current.phone,
  };

  mockCustomers = mockCustomers.map((customer) =>
    customer.id === id ? updatedCustomer : customer,
  );

  return cloneCustomer(updatedCustomer);
}

export async function deleteCustomer(id) {
  if (API_URL) {
    await apiRequest(`/customers/${id}`, { method: "DELETE" });
    return id;
  }

  await wait();
  const exists = mockCustomers.some((customer) => customer.id === id);
  if (!exists) throw new Error("Silinecek müşteri bulunamadı.");

  mockCustomers = mockCustomers.filter((customer) => customer.id !== id);
  return id;
}
