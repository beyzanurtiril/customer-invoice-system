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
import useInvoices from "../hooks/useInvoices";

export default function InvoicesPage() {
  const { invoices, loading, error, reload } = useInvoices();

  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>Faturalar</h1>
        <p>Senaryo Analizi: Fatura Durumları ve Aksiyonlar</p>
      </div>

      {error ? (
        <StatusMessage tone="danger" action={<Button onClick={reload}>Tekrar dene</Button>}>
          {error}
        </StatusMessage>
      ) : null}

      <InvoiceTable invoices={invoices} loading={loading} />
    </section>
  );
}
