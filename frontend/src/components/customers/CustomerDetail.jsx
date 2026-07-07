/*
  COMPONENT: CustomerDetail

  Seçilen müşterinin temel bilgilerini ve fatura özetini gösterir.
*/

import { useLanguage } from "../../context/LanguageContext";
import { getCustomerTagTone } from "../../utils/customerFilter";
import Badge from "../ui/Badge";

export default function CustomerDetail({ customer }) {
  const { t, tv } = useLanguage();

  if (!customer) return null;

  return (
    <div className="customer-detail">
      <div className="customer-detail__top">
        <div className="avatar avatar--large">
          {customer.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <strong>{customer.phone}</strong>
          <span>{customer.email}</span>
          <Badge tone={getCustomerTagTone(customer.tag)}>
            {t("customers_detail_badge", { tag: tv(customer.tag) })}
          </Badge>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <span>{t("customers_table_line_type")}</span>
          <strong>{tv(customer.lineType)}</strong>
        </div>
        <div>
          <span>{t("customers_detail_package")}</span>
          <strong>{tv(customer.packageName)}</strong>
        </div>
        <div>
          <span>{t("customers_table_city")}</span>
          <strong>{tv(customer.city)}</strong>
        </div>
      </div>

      <h3>{t("customers_detail_invoice_summary")}</h3>
      <div className="invoice-list">
        <div>
          <span>{t("customers_detail_current_month")}</span>
          <strong>{customer.lastInvoice}</strong>
          <Badge tone={customer.statusTone}>{tv(customer.status)}</Badge>
        </div>
        <div>
          <span>{t("customers_detail_previous_month_1")}</span>
          <strong>590 ₺</strong>
          <Badge tone="success">{tv("Ödendi")}</Badge>
        </div>
        <div>
          <span>{t("customers_detail_previous_month_2")}</span>
          <strong>560 ₺</strong>
          <Badge tone="success">{tv("Ödendi")}</Badge>
        </div>
      </div>
    </div>
  );
}
