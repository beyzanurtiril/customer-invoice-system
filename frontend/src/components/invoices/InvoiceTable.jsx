/*
  COMPONENT: InvoiceTable

  Backend veya mock kaynaktan gelen faturaları tablo halinde gösterir.
  Bu component veri çekmez; yalnızca `invoices` propundaki veriyi ekrana basar.

  TASARIM:
  invoices.css -> `.invoice-table-wrap`, `.invoice-table`, `.invoice-action`
  Badge renkleri:
  customers.css -> `.badge`, `.badge--success`, `.badge--warning`, `.badge--danger`
*/

import { useLanguage } from "../../context/LanguageContext";
import Badge from "../ui/Badge";

export default function InvoiceTable({ invoices, loading }) {
  const { t, tv } = useLanguage();

  return (
    <div className="invoice-table-wrap">
      <table className="invoice-table">
        <thead>
          <tr>
            <th>{t("invoices_table_id")}</th>
            <th>{t("invoices_table_customer")}</th>
            <th>{t("invoices_table_invoice_date")}</th>
            <th>{t("invoices_table_due_date")}</th>
            <th>{t("invoices_table_amount")}</th>
            <th>{t("invoices_table_status")}</th>
            <th>{t("invoices_table_action")}</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr className="invoice-state-row">
              <td colSpan="7">{t("invoices_loading")}</td>
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
                  <Badge tone={invoice.statusTone}>{tv(invoice.status)}</Badge>
                </td>
                <td
                  className={
                    invoice.actionRecommendation === "—"
                      ? "invoice-action invoice-action--empty"
                      : "invoice-action"
                  }
                >
                  {tv(invoice.actionRecommendation)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!loading && !invoices.length ? (
        <div className="invoice-empty-state">{t("invoices_empty")}</div>
      ) : null}
    </div>
  );
}
