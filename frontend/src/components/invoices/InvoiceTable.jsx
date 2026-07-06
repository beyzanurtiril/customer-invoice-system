/*
  COMPONENT: InvoiceTable

  Backend veya mock kaynaktan gelen faturaları tablo halinde gösterir.
  Bu component veri çekmez; yalnızca `invoices` propundaki veriyi ekrana basar.

  TASARIM:
  invoices.css -> `.invoice-table-wrap`, `.invoice-table`, `.invoice-action`
  Badge renkleri:
  customers.css -> `.badge`, `.badge--success`, `.badge--warning`, `.badge--danger`
*/

import Badge from "../ui/Badge";

export default function InvoiceTable({ invoices, loading }) {
  return (
    <div className="invoice-table-wrap">
      <table className="invoice-table">
        <thead>
          <tr>
            <th>FATURA ID</th>
            <th>MÜŞTERİ</th>
            <th>FATURA TARİHİ</th>
            <th>SON ÖDEME (DUE)</th>
            <th>TUTAR</th>
            <th>DURUM</th>
            <th>AKSİYON ÖNERİSİ</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr className="invoice-state-row">
              <td colSpan="7">Faturalar yükleniyor…</td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <strong>{invoice.id}</strong>
                </td>
                <td>{invoice.customerName}</td>
                <td>{invoice.invoiceDate}</td>
                <td>{invoice.dueDate}</td>
                <td>
                  <strong>{invoice.amount}</strong>
                </td>
                <td>
                  <Badge tone={invoice.statusTone}>{invoice.status}</Badge>
                </td>
                <td
                  className={
                    invoice.actionRecommendation === "—"
                      ? "invoice-action invoice-action--empty"
                      : "invoice-action"
                  }
                >
                  {invoice.actionRecommendation}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!loading && !invoices.length ? (
        <div className="invoice-empty-state">Gösterilecek fatura bulunamadı.</div>
      ) : null}
    </div>
  );
}
