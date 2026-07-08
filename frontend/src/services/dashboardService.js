/*
  DOSYA: dashboardService.js

  Dashboard için backend entegrasyonu burada yapılır.

  Backend'de GET /api/dashboard endpointi yok. Yeni endpoint eklemiyoruz.
  Mevcut dashboard UI'ını bozmadan şu endpointlerden veri toplanır:
  - GET /customers
  - GET /customers/{customerId}/invoices
  - GET /analysis/revenue-forecast
  - GET /analysis/upgrade-recommendations
  - GET /analysis/regional-payments
*/

import { mockDashboardData } from "../data/mockDashboardData";
import { apiRequest, isApiEnabled } from "./apiClient";

const MOCK_DELAY_MS = 350;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneDashboardData(data) {
  return JSON.parse(JSON.stringify(data));
}

function formatMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return Number(value).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });
}

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString("tr-TR");
}

/*
  Backend DashboardResponse şuna benzer geliyor:

  {
    periodLabel,
    stats: {
      totalCustomers,
      monthlyRevenue,
      overdueInvoiceCount,
      riskyCustomerCount
    },
    revenuePoints: [
      { month/yearMonth, value/revenue }
    ],
    packageDistribution: [
      { category, count, percentage }
    ],
    activeLineCount,
    cityRevenue: [
      { city, totalRevenue/value }
    ],
    recommendations: [
      "öneri metni"
    ]
  }

  Mevcut Dashboard UI ise stats array, recommendations object array gibi alanlar bekliyor.
  Bu yüzden UI'a dokunmadan backend cevabını burada mevcut UI formatına çeviriyoruz.
*/
function normalizeDashboardResponse(response) {
  const stats = response?.stats ?? {};

  return {
    periodLabel: response?.periodLabel ?? "Backend verileri",

    stats: [
      {
        label: "TOPLAM MÜŞTERİ",
        value: formatNumber(stats.totalCustomers),
        change: "Backend dashboard verisi",
        tone: "default",
      },
      {
        label: "AYLIK GELİR",
        value: formatMoney(stats.monthlyRevenue),
        change: "Son fatura ayından hesaplandı",
        tone: "success",
      },
      {
        label: "GECİKEN FATURA",
        value: formatNumber(stats.overdueInvoiceCount),
        change: "Vadesi geçmiş ödenmemiş faturalar",
        tone: "warning",
      },
      {
        label: "RİSKLİ MÜŞTERİ",
        value: formatNumber(stats.riskyCustomerCount),
        change: "Son 12 ay gecikme analizinden",
        tone: "danger",
      },
    ],

    revenuePoints: (response?.revenuePoints ?? []).map((item) => ({
      month: item.month ?? item.yearMonth ?? "—",
      value: Number(item.value ?? item.revenue ?? 0),
    })),

    packageDistribution: (response?.packageDistribution ?? []).map((item, index) => {
      // "line" kenarlık rengiydi ve dilimi görünmez yapıyordu; belirgin palet kullanılıyor.
      const tones = ["accent", "blue", "teal", "purple", "orange", "rose"];

      return {
        label: item.category ?? item.label ?? "Paket",
        value: Number(item.count ?? item.value ?? 0),
        percentage: Number(item.percentage ?? 0),
        tone: tones[index % tones.length],
      };
    }),

    activeLineCount: Number(response?.activeLineCount ?? 0),

    cityRevenue: (response?.cityRevenue ?? []).map((item) => ({
      // Backend "city" alanında şehir tipi (BÜYÜKŞEHİR vb.) dönebiliyor;
      // asıl şehir adı regionName'de. Önce onu kullan.
      city: item.regionName ?? item.city ?? "—",
      value: Number(item.totalRevenue ?? item.value ?? 0),
      group: "Bölge",
    })),

    recommendations: (response?.recommendations ?? []).map((text, index) => ({
      title: text,
      description: "Backend dashboard önerisi",
      tone: index === 1 ? "danger" : "accent",
    })),
  };
}

export async function getDashboardData() {
  if (isApiEnabled()) {
    const response = await apiRequest("/dashboard");
    return normalizeDashboardResponse(response);
  }

  await wait();
  return cloneDashboardData(mockDashboardData);
}
