/*
  PAGE: InvoicesPage

  Faturalar ekranının sayfa seviyesindeki merkezidir.
  Fatura verisini useInvoices hook'undan alır ve InvoiceTable'a gönderir.

  Backend bağlantısı için componentte değişiklik yapılmaz.
  Yalnızca invoiceService.js içindeki GET /invoices endpoint'i kullanılır.
*/

import InvoiceTable from "../components/invoices/InvoiceTable";
import Button from "../components/ui/Button";
import StatusMessage from "../components/ui/StatusMessage";
import { useLanguage } from "../context/LanguageContext";
import useInvoices from "../hooks/useInvoices";

export default function InvoicesPage() {
  const { invoices, loading, error, reload } = useInvoices();
  const { t, tv } = useLanguage();

  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>{t("invoices_title")}</h1>
        <p>{t("invoices_subtitle")}</p>
      </div>

      {error ? (
        <StatusMessage tone="danger" action={<Button onClick={reload}>{t("button_retry")}</Button>}>
          {tv(error)}
        </StatusMessage>
      ) : null}

      <InvoiceTable invoices={invoices} loading={loading} />
    </section>
  );
}
