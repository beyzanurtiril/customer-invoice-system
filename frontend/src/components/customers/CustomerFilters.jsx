/*
  COMPONENT: CustomerFilters

  Müşteriler sayfasında sürekli görünen beşli filtre panelini oluşturur.
  Select value'ları veriyle uyumlu kalması için Türkçe tutulur;
  option metinleri useLanguage().tv ile seçili dile göre çevrilir.
*/

import { useLanguage } from "../../context/LanguageContext";
import { getTagOptions } from "../../utils/customerFilter";

export default function CustomerFilters({ filters, onChange }) {
  const { t, tv } = useLanguage();
  const tagOptions = getTagOptions(filters.lineType);

  return (
    <div className="filter-panel">
      <label>
        <span>{t("customers_filter_line_type")}</span>
        <select
          value={filters.lineType}
          onChange={(event) => onChange("lineType", event.target.value)}
        >
          <option value="Tümü">{tv("Tümü")}</option>
          <option value="Faturalı">{tv("Faturalı")}</option>
          <option value="Faturasız">{tv("Faturasız")}</option>
        </select>
      </label>

      <label>
        <span>{t("customers_filter_tag")}</span>
        <select value={filters.tag} onChange={(event) => onChange("tag", event.target.value)}>
          {tagOptions.map((option) => (
            <option key={option} value={option}>
              {tv(option)}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>{t("customers_filter_city_region")}</span>
        <select value={filters.city} onChange={(event) => onChange("city", event.target.value)}>
          <option value="Tümü">{tv("Tümü")}</option>
        </select>
      </label>

      <label>
        <span>{t("customers_filter_delay")}</span>
        <select value={filters.delay} onChange={(event) => onChange("delay", event.target.value)}>
          <option value="3+ kez">{tv("3+ kez")}</option>
          <option value="Tümü">{tv("Tümü")}</option>
        </select>
      </label>

      <label>
        <span>{t("customers_filter_monthly_invoice")}</span>
        <select
          value={filters.monthlyInvoice}
          onChange={(event) => onChange("monthlyInvoice", event.target.value)}
        >
          <option value="Tümü">{tv("Tümü")}</option>
        </select>
      </label>
    </div>
  );
}
