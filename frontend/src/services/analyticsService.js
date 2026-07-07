/*
  DOSYA: analyticsService.js

  Analizler ekranı ile veri kaynağı arasındaki bağlantı katmanıdır.
  Componentler fetch çağrısı yapmaz; yalnızca bu servisten gelen sonucu kullanır.

  VITE_API_URL boşsa mockAnalyticsData döner.
  VITE_API_URL doluysa GET /analytics isteği yapılır.

  Beklenen temel backend cevabı:
  {
    revenueForecast: { subtitle, averageLabel, averageValue, estimates },
    overage: { subtitle, items }
  }
*/

import { mockAnalyticsData } from "../data/mockAnalyticsData";

// Sondaki / işaretini kaldırarak çift slash oluşmasını engeller.
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const MOCK_DELAY_MS = 350;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// Mock objenin componentler tarafından yanlışlıkla değiştirilmesini engellemek için kopya döner.
function cloneAnalyticsData(data) {
  return JSON.parse(JSON.stringify(data));
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
    throw new Error(payload?.message ?? `Analiz isteği başarısız oldu (${response.status}).`);
  }

  return response.json();
}

// Analizler ekranının bütün verisini tek istekle getirir.
export async function getAnalyticsData() {
  if (API_URL) {
    return apiRequest("/analytics");
  }

  await wait();
  return cloneAnalyticsData(mockAnalyticsData);
}
