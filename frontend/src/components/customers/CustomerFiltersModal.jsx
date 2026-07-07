/*
  COMPONENT: CustomerFiltersModal

  "Filtreler" butonuna basıldığında açılan gelişmiş filtre modalıdır.
  Select value'ları gerçek filtre değerleri olarak Türkçe kalır; görünen metinler çevrilir.
*/

import { useLanguage } from "../../context/LanguageContext";
import { getTagOptions } from "../../utils/customerFilter";
import Button from "../ui/Button";
import FormField from "../ui/FormField";
import Modal from "../ui/Modal";

export default function CustomerFiltersModal({ open, filters, onChange, onClose, onApply }) {
  const { t, tv } = useLanguage();
  const tagOptions = getTagOptions(filters.lineType);

  return (
    <Modal
      open={open}
      title={t("customers_filter_modal_title")}
      subtitle={t("customers_filter_modal_subtitle")}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t("button_cancel")}</Button>
          <Button variant="primary" onClick={onApply}>
            {t("customers_filter_apply")}
          </Button>
        </>
      }
    >
      <div className="modal-form-grid">
        <FormField label={t("customers_form_line_type")}>
          <select value={filters.lineType} onChange={(event) => onChange("lineType", event.target.value)}>
            <option value="Tümü">{tv("Tümü")}</option>
            <option value="Faturalı">{tv("Faturalı")}</option>
            <option value="Faturasız">{tv("Faturasız")}</option>
          </select>
        </FormField>
        <FormField label={t("customers_form_tag")}>
          <select value={filters.tag} onChange={(event) => onChange("tag", event.target.value)}>
            {tagOptions.map((option) => (
              <option key={option} value={option}>
                {tv(option)}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t("customers_filter_city_region")}>
          <select value={filters.city} onChange={(event) => onChange("city", event.target.value)}>
            <option value="Tümü">{tv("Tümü")}</option>
            <option value="İstanbul">{tv("İstanbul")}</option>
            <option value="Ankara">{tv("Ankara")}</option>
          </select>
        </FormField>
        <FormField label={t("customers_filter_last_12_months")}>
          <select value={filters.delay} onChange={(event) => onChange("delay", event.target.value)}>
            <option value="3+ kez">{tv("3+ kez")}</option>
            <option value="Tümü">{tv("Tümü")}</option>
          </select>
        </FormField>
        <FormField label={t("customers_filter_invoice_range")}>
          <input
            value={filters.monthlyInvoice === "Tümü" ? tv("0 ₺ — 1.500 ₺") : tv(filters.monthlyInvoice)}
            readOnly
          />
        </FormField>
      </div>
    </Modal>
  );
}
