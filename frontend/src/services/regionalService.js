/*
  DOSYA: regionalService.js

  Bölgesel ekranı ile veri kaynağı arasındaki bağlantı katmanıdır.
  Componentler fetch çağrısı yapmaz; yalnızca bu servisten gelen sonucu kullanır.

  VITE_API_URL boşsa mockRegionalData döner.
  VITE_API_URL doluysa GET /regional isteği yapılır.

  Beklenen temel backend cevabı:
  {
    cityRevenue: { subtitle, unit, items },
    mobilePayments: { subtitle, unit, items }
  }
*/

import { mockRegionalData } from "../data/mockRegionalData";

// Sondaki / işaretini kaldırarak çift slash oluşmasını engeller.
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const MOCK_DELAY_MS = 350;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// Mock objenin componentler tarafından yanlışlıkla değiştirilmesini engellemek için kopya döner.
function cloneRegionalData(data) {
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
    throw new Error(payload?.message ?? `Bölgesel veri isteği başarısız oldu (${response.status}).`);
  }

  return response.json();
}

// Bölgesel ekranının bütün verisini tek istekle getirir.
export async function getRegionalData() {
  if (API_URL) {
    return apiRequest("/regional");
  }

  await wait();
  return cloneRegionalData(mockRegionalData);
}
