/*
  DOSYA: analyticsService.js

  Analizler ekranı için backend endpointleri:
  - GET /analysis/revenue-forecast
  - GET /analysis/upgrade-recommendations

  UI componentlerini değiştirmiyoruz; response'u burada mevcut kartların beklediği hale getiriyoruz.
*/

import { mockAnalyticsData } from "../data/mockAnalyticsData";
import { apiRequest, getListFromResponse, isApiEnabled } from "./apiClient";

const MOCK_DELAY_MS = 350;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneAnalyticsData(data) {
  return JSON.parse(JSON.stringify(data));
}

function formatMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";

  return Number(value).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });
}

function normalizeRevenueForecast(response) {
  return {
    ...response,
    subtitle: "Ciro Tahmini",
    averageLabel: "Sonraki ay tahmini",
    averageValue: formatMoney(response?.nextMonthForecast),
    estimates: [
      {
        year: "Sonraki Ay",
        value: formatMoney(response?.nextMonthForecast),
        change: `R²: ${Number(response?.rSquared ?? 0).toFixed(2)}`,
        tone: "success",
      },
      {
        year: "Sonraki Yıl",
        value: formatMoney(response?.nextYearForecast),
        change: "Forecast",
        tone: "success",
      },
    ],
  };
}

function normalizeUpgradeRecommendations(response) {
  const items = getListFromResponse(response);

  return {
    subtitle: "Üst Paket Önerileri",
    items: items.map((item) => ({
      ...item,
      customerName: item.customerFullName,
      overageAmount: formatMoney(item.totalOverageAmount),
      currentTier: item.currentProductName ?? `Ürün #${item.currentProductId}`,
      suggestedTier: item.recommendation,
    })),
  };
}

export async function getAnalyticsData() {
  if (isApiEnabled()) {
    const [revenueForecast, upgradeRecommendations] = await Promise.all([
      apiRequest("/analysis/revenue-forecast"),
      apiRequest("/analysis/upgrade-recommendations"),
    ]);

    return {
      revenueForecast: normalizeRevenueForecast(revenueForecast),
      overage: normalizeUpgradeRecommendations(upgradeRecommendations),
    };
  }

  await wait();
  return cloneAnalyticsData(mockAnalyticsData);
}
