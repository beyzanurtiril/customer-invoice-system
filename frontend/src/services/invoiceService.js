/*
  DOSYA: invoiceService.js

  Faturalar sayfası için backend entegrasyonu burada yapılır.

  Backend'de global GET /api/invoices endpointi yok.
  Bu yüzden mevcut InvoicesPage UI'ını bozmadan:
  1. /customers ile müşteriler alınır.
  2. Her müşteri için /customers/{customerId}/invoices çağrılır.
  3. Faturalar mevcut InvoiceTable'ın beklediği alanlara çevrilir.
*/

import { mockInvoices } from "../data/mockInvoiceData";
import {
  apiRequest,
  getListFromResponse,
  isApiEnabled,
  optionalApiRequest,
} from "./apiClient";

const MOCK_DELAY_MS = 350;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneInvoices(invoices) {
  return invoices.map((invoice) => ({ ...invoice }));
}

function formatMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";

  return Number(value).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("tr-TR");
}

function getCustomerName(customer) {
  return [customer?.name, customer?.surname].filter(Boolean).join(" ").trim() || "—";
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

  return status || "Bekliyor";
}

function getPaymentStatusTone(statusLabel) {
  if (statusLabel === "Ödendi") return "success";
  if (statusLabel === "Gecikmiş Ödeme") return "danger";

  return "warning";
}

/*
  ESKİ YAKLAŞIM (kaldırıldı): Her fatura için /invoices/{id}/collection-actions
  ayrı ayrı çağrılıyordu. Fatura sayısı kadar ekstra HTTP isteği demekti ve
  backend bağlantı havuzunu tüketip 500'lere yol açan yükün büyük parçasıydı.

  YENİ YAKLAŞIM: Liste ekranında aksiyon önerisi borç durumundan lokal hesaplanır.
  Gerçek tahsilat aksiyon geçmişi gerektiğinde (ör. fatura detayı) aşağıdaki
  getInvoiceCollectionActions(invoiceId) ile tek fatura için çekilir.
*/
function getCollectionActionText(invoice) {
  if (Number(invoice.dueAmount ?? 0) > 0) return "Tahsilat aksiyonu gerekli";
  return "—";
}

export async function getInvoiceCollectionActions(invoiceId) {
  if (!invoiceId) return [];

  const response = await optionalApiRequest(`/invoices/${invoiceId}/collection-actions`, []);
  const actions = getListFromResponse(response);
  const latestFirst = [...actions].sort((first, second) => {
    const firstDate = new Date(first.actionDate ?? 0).getTime();
    const secondDate = new Date(second.actionDate ?? 0).getTime();
    return secondDate - firstDate;
  });

  return latestFirst;
}

function normalizeInvoice(invoice, customer) {
  const status = normalizePaymentStatus(invoice.paymentStatus, invoice.dueDate, invoice.dueAmount);
  const actionRecommendation = getCollectionActionText(invoice);

  return {
    ...invoice,

    // Mevcut InvoiceTable'ın kullandığı alanlar.
    id: `INV-${invoice.invoiceId}`,
    // Backend InvoiceResponse zaten customerName döndürüyor; müşteri objesi opsiyonel.
    customerName: invoice.customerName ?? getCustomerName(customer),
    invoiceDate: formatDate(invoice.invoiceDate),
    dueDate: formatDate(invoice.dueDate),
    amount: formatMoney(invoice.invoiceAmount),
    status,
    statusTone: getPaymentStatusTone(status),
    actionRecommendation,

    // Backend alanları korunuyor; UI'a sonra istersek ekleriz.
    invoiceId: invoice.invoiceId,
    customerId: invoice.customerId,
    product: invoice.product,
    productName: invoice.product?.name ?? "",
    paymentChannel: invoice.paymentChannel,
    invoiceAmount: invoice.invoiceAmount,
    dueAmount: invoice.dueAmount,
    overageAmount: invoice.overageAmount,
    paymentDate: invoice.paymentDate,
    paymentStatus: invoice.paymentStatus,
  };
}

export async function getInvoices() {
  if (isApiEnabled()) {
    /*
      Backend'de zaten global GET /api/invoices var (InvoiceListController) ve
      JOIN FETCH ile müşteri+ürünü tek sorguda getiriyor. Eski müşteri-başına
      döngü yerine TEK istek atıyoruz.
    */
    const response = await apiRequest("/invoices?page=0&size=2000&sort=invoiceDate,desc");
    const invoices = getListFromResponse(response);

    return invoices.map((invoice) => normalizeInvoice(invoice, null));
  }

  await wait();
  return cloneInvoices(mockInvoices);
}
