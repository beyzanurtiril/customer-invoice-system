/*
  DOSYA: dashboardService.js

  Dashboard ekranı ile veri kaynağı arasındaki bağlantı katmanıdır.
  Componentler fetch çağrısı yapmaz; yalnızca bu servisten gelen sonucu kullanır.

  VITE_API_URL boşsa mockDashboardData döner.
  VITE_API_URL doluysa GET /dashboard isteği yapılır.

  Beklenen temel backend cevabı:
  {
    periodLabel,
    stats,
    revenuePoints,
    packageDistribution,
    activeLineCount,
    cityRevenue,
    recommendations
  }
*/

import { mockDashboardData } from "../data/mockDashboardData";

// Sondaki / işaretini kaldırarak çift slash oluşmasını engeller.
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const MOCK_DELAY_MS = 350;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// Mock objenin componentler tarafından yanlışlıkla değiştirilmesini engellemek için kopya döner.
function cloneDashboardData(data) {
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
    throw new Error(payload?.message ?? `Dashboard isteği başarısız oldu (${response.status}).`);
  }

  return response.json();
}

// Dashboard ekranının bütün verisini tek istekle getirir.
export async function getDashboardData() {
  if (API_URL) {
    return apiRequest("/dashboard");
  }

  await wait();
  return cloneDashboardData(mockDashboardData);
}
