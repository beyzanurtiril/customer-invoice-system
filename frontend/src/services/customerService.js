import { initialCustomers } from "../data/mockData";
import {
  apiRequest,
  getListFromResponse,
  isApiEnabled,
  optionalApiRequest,
} from "./apiClient";

const MOCK_DELAY_MS = 350;

let mockCustomers = initialCustomers.map((customer) => ({ ...customer }));
let cachedRegions = null;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneCustomer(customer) {
  return customer ? { ...customer } : customer;
}

function formatMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";

  return Number(value).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
}

function getCustomerId(customer) {
  return customer.customerId ?? customer.id;
}

function getFullName(customer) {
  return [customer?.name, customer?.surname].filter(Boolean).join(" ").trim();
}

function normalizeRiskTag(riskTag) {
  const value = String(riskTag ?? "").toUpperCase();

  if (value.includes("RISK") || value.includes("HIGH")) return "Riskli";
  if (value.includes("ACTIVE")) return "Aktif";
  if (value.includes("PASSIVE")) return "Pasif";

  return "Güvenilir";
}

function normalizePaymentStatus(status, dueDate, dueAmount) {
  const value = String(status ?? "").toUpperCase();
  const hasDebt = Number(dueAmount ?? 0) > 0;
  const isOverdue = dueDate ? new Date(dueDate) < new Date() : false;

  if (value.includes("PAID") || value.includes("ÖDENDİ")) return "Ödendi";
  if (value.includes("OVERDUE") || value.includes("LATE") || (hasDebt && isOverdue)) {
    return "Gecikmiş Ödeme";
  }
  if (value.includes("PENDING") || value.includes("UNPAID") || hasDebt) return "Bekliyor";

  return status || "Yeni kayıt";
}

function getStatusTone(statusLabel) {
  if (statusLabel === "Ödendi") return "success";
  if (statusLabel === "Gecikmiş Ödeme") return "danger";
  if (statusLabel === "Yeni kayıt") return "success";

  return "warning";
}

function getLatestInvoice(invoices) {
  return [...invoices].sort((first, second) => {
    const firstDate = new Date(first.invoiceDate ?? first.dueDate ?? 0).getTime();
    const secondDate = new Date(second.invoiceDate ?? second.dueDate ?? 0).getTime();

    return secondDate - firstDate;
  })[0];
}

/*
  ESKİ YAKLAŞIM (kaldırıldı): Liste ekranında HER müşteri için
  /customers/{id}/invoices ve /subscriptions/by-customer/{id} çağrılıyordu.
  100 müşteri = 201 HTTP isteği; backend'in 2 bağlantılık havuzu ve uzak
  Supabase gecikmesiyle birleşince istekler timeout'a düşüp 500 dönüyordu.

  YENİ YAKLAŞIM: Tüm faturalar backend'in zaten var olan GET /invoices
  endpoint'inden TEK istekle çekilir, müşteriye göre burada gruplanır.
  Subscription detayı liste için gerekli değil; müşteri detayı açıldığında
  getCustomerDetail(id) ile tek müşteri için çekilir.
*/
async function getAllInvoicesGroupedByCustomer() {
  const response = await optionalApiRequest("/invoices?page=0&size=2000", null);
  const invoices = getListFromResponse(response);

  const grouped = new Map();
  invoices.forEach((invoice) => {
    const key = String(invoice.customerId ?? "");
    if (!key) return;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(invoice);
  });

  return grouped;
}

/* Detay ekranı için: tek müşterinin faturaları + aboneliği (2 istek, sadece o an). */
export async function getCustomerExtraData(customer) {
  const customerId = getCustomerId(customer);

  if (!customerId) {
    return { invoices: [], subscription: null };
  }

  const [invoiceResponse, subscription] = await Promise.all([
    optionalApiRequest(`/customers/${customerId}/invoices`, []),
    optionalApiRequest(`/subscriptions/by-customer/${customerId}`, null),
  ]);

  return {
    invoices: getListFromResponse(invoiceResponse),
    subscription,
  };
}

function normalizeCustomer(customer, extraData = {}) {
  const customerId = getCustomerId(customer);
  const latestInvoice = getLatestInvoice(extraData.invoices ?? []);
  const subscriptionProduct = extraData.subscription?.product;
  const invoiceProduct = latestInvoice?.product;
  const product = subscriptionProduct ?? invoiceProduct;
  const status = latestInvoice
    ? normalizePaymentStatus(latestInvoice.paymentStatus, latestInvoice.dueDate, latestInvoice.dueAmount)
    : "Yeni kayıt";

  return {
    ...customer,

    // Mevcut CustomerTable ve filtrelerin beklediği alanlar.
    id: String(customerId),
    name: getFullName(customer) || customer.name || "İsimsiz müşteri",
    phone: customer.phone ?? "—",
    email: customer.email ?? "—",
    lineType:
      product?.subscriptionType === "PREPAID" || product?.subscriptionType === "Faturasız"
        ? "Faturasız"
        : "Faturalı",
    city:
      customer.region?.name ??
      customer.region?.city ??
      customer.region?.cityType ??
      customer.city ??
      "—",
    tag: normalizeRiskTag(customer.riskTag),
    lastInvoice: latestInvoice ? formatMoney(latestInvoice.invoiceAmount) : "—",
    status,
    statusTone: getStatusTone(status),
    packageName: product?.name ?? customer.packageName ?? "—",

    // Backend alanları objenin içinde korunuyor; UI'a sonra istersek ekleriz.
    customerId,
    firstName: customer.name ?? "",
    surname: customer.surname ?? "",
    birthDate: customer.birthDate ?? "",
    address: customer.address ?? "",
    regionId: customer.region?.regionId ?? customer.regionId ?? "",
    ageGroup: customer.ageGroup ?? "",
    paymentChannelPreference: customer.paymentChannelPreference ?? "",
    hasAutopay: Boolean(customer.hasAutopay),
    riskTag: customer.riskTag ?? "",
    invoices: extraData.invoices ?? [],
    subscription: extraData.subscription ?? null,
  };
}

function splitFullName(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    name: parts[0] ?? "",
    surname: parts.slice(1).join(" ") || "Belirtilmedi",
  };
}

async function getRegions() {
  if (!cachedRegions) {
    cachedRegions = apiRequest("/regions").then(getListFromResponse);
  }

  return cachedRegions;
}

async function resolveRegionId(input) {
  if (input.regionId) return Number(input.regionId);

  const regions = await getRegions();
  const formCity = normalizeText(input.city);

  const matchedRegion = regions.find((region) => {
    const regionName = normalizeText(region.name);
    const regionCity = normalizeText(region.city);
    const regionCityType = normalizeText(region.cityType);

    return regionName === formCity || regionCity === formCity || regionCityType === formCity;
  });

  if (matchedRegion?.regionId) return Number(matchedRegion.regionId);
  if (regions[0]?.regionId) return Number(regions[0].regionId);

  throw new Error("Müşteri kaydı için kullanılacak bölge bulunamadı.");
}

async function buildCustomerRequest(input) {
  const nameParts = splitFullName(input.name);

  return {
    name: input.firstName || nameParts.name,
    surname: input.surname || nameParts.surname,
    birthDate: input.birthDate || null,
    address: input.address || "",
    email: input.email || "",
    phone: input.phone || "",
    regionId: await resolveRegionId(input),
    ageGroup: input.ageGroup || "",
    paymentChannelPreference: input.paymentChannelPreference || "",
    hasAutopay: Boolean(input.hasAutopay),
  };
}

function nextMockId() {
  const ids = mockCustomers.map((customer) => Number(customer.id)).filter(Number.isFinite);
  return String((ids.length ? Math.max(...ids) : 1000) + 1);
}

export async function getCustomers() {
  if (isApiEnabled()) {
    // Toplam 2 istek: müşteri listesi + tüm faturalar (müşteriye göre burada gruplanır).
    const [customerResponse, invoicesByCustomer] = await Promise.all([
      apiRequest("/customers?page=0&size=500&sort=customerId,asc"),
      getAllInvoicesGroupedByCustomer(),
    ]);

    const customers = getListFromResponse(customerResponse);

    return customers.map((customer) => {
      const invoices = invoicesByCustomer.get(String(getCustomerId(customer))) ?? [];
      return normalizeCustomer(customer, { invoices, subscription: null });
    });
  }

  await wait();
  return mockCustomers.map(cloneCustomer);
}

export async function createCustomer(input) {
  if (isApiEnabled()) {
    const payload = await buildCustomerRequest(input);

    const createdCustomer = await apiRequest("/customers", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return normalizeCustomer(createdCustomer);
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
  if (isApiEnabled()) {
    const payload = await buildCustomerRequest(input);

    const updatedCustomer = await apiRequest(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return normalizeCustomer(updatedCustomer);
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
  if (isApiEnabled()) {
    await apiRequest(`/customers/${id}`, { method: "DELETE" });
    return id;
  }

  await wait();
  const exists = mockCustomers.some((customer) => customer.id === id);
  if (!exists) throw new Error("Silinecek müşteri bulunamadı.");

  mockCustomers = mockCustomers.filter((customer) => customer.id !== id);
  return id;
}
