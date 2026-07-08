/*
  DOSYA: regionalService.js

  Bölgesel ekranı için backend endpointi:
  - GET /analysis/regional-payments

  UI componentlerini değiştirmiyoruz. Backend'deki tek bölgesel analiz listesini
  mevcut iki grafik yapısına burada çeviriyoruz.
*/

import { mockRegionalData } from "../data/mockRegionalData";
import { apiRequest, getListFromResponse, isApiEnabled } from "./apiClient";

const MOCK_DELAY_MS = 350;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneRegionalData(data) {
  return JSON.parse(JSON.stringify(data));
}

function toThousands(value) {
  return Math.round(Number(value ?? 0) / 1000);
}

function normalizeRegionalData(response) {
  const items = getListFromResponse(response);

  return {
    // Türkiye haritası bileşeni ham bölge kayıtlarını kullanır (regionName,
    // totalRevenue, totalInvoiceCount, averageInvoiceAmount, overdueRatePercentage).
    mapItems: items,

    cityRevenue: {
      subtitle: "Bölgelere göre toplam gelir",
      unit: "Bin ₺",
      items: items.map((item) => ({
        ...item,
        // Backend "city" alanında şehir tipi taşıyor; asıl şehir adı regionName.
        label: item.regionName || item.city || item.name,
        value: toThousands(item.totalRevenue),
      })),
    },

    mobilePayments: {
      subtitle: "Bölgelere göre fatura adedi",
      unit: "Fatura",
      items: items.map((item) => ({
        ...item,
        // Backend "city" alanında şehir tipi taşıyor; asıl şehir adı regionName.
        label: item.regionName || item.city || item.name,
        value: Number(item.totalInvoiceCount ?? 0),
      })),
    },
  };
}

export async function getRegionalData() {
  if (isApiEnabled()) {
    const response = await apiRequest("/analysis/regional-payments");
    return normalizeRegionalData(response);
  }

  await wait();
  return cloneRegionalData(mockRegionalData);
}
