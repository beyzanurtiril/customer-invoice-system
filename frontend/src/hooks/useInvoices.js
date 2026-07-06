/*
  HOOK: useInvoices

  Fatura listesinin yüklenmesini, loading durumunu ve hata mesajını yönetir.
  InvoicesPage yalnızca bu hook'u kullanır; backend veya mock ayrıntısını bilmez.

  Veri akışı:
  InvoicesPage -> useInvoices -> invoiceService -> Backend veya mock veri
*/

import { useCallback, useEffect, useState } from "react";
import { getInvoices } from "../services/invoiceService";

export default function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sayfadaki "Tekrar dene" butonunun kullanacağı manuel yenileme fonksiyonu.
  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const invoiceData = await getInvoices();
      setInvoices(invoiceData);
    } catch (requestError) {
      setError(requestError.message || "Faturalar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Faturalar sayfası ilk kez açıldığında veriyi getirir.
  useEffect(() => {
    let active = true;

    getInvoices()
      .then((invoiceData) => {
        if (active) setInvoices(invoiceData);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Faturalar yüklenemedi.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    invoices,
    loading,
    error,
    reload: loadInvoices,
  };
}
