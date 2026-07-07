/*
  COMPONENT: CustomerForm

  Hem yeni müşteri ekleme hem de var olan müşteriyi güncelleme ekranında kullanılan ortak formdur.
  Select value'ları veriyle uyumlu kalması için Türkçe tutulur, görünen option metinleri çevrilir.
*/

import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { getTagOptions } from "../../utils/customerFilter";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

const defaultValues = {
  name: "",
  phone: "",
  email: "",
  lineType: "Faturalı",
  city: "İstanbul",
  packageName: "İnternet 30 GB",
  tag: "Güvenilir",
};

const cities = ["İstanbul", "Ankara", "İzmir", "Antalya", "Trabzon"];

export default function CustomerForm({
  initialValues = defaultValues,
  phoneLocked = false,
  submitLabel,
  submitting = false,
  onCancel,
  onSubmit,
}) {
  const { t, tv } = useLanguage();
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });
  const tagOptions = getTagOptions(form.lineType, false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      if (name !== "lineType") {
        return { ...current, [name]: value };
      }

      const tagOptions = getTagOptions(value, false);

      return {
        ...current,
        lineType: value,
        tag: tagOptions.includes(current.tag) ? current.tag : tagOptions[0],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="modal-form-grid" onSubmit={handleSubmit}>
      <FormField label={t("customers_form_name")}>
        <input required name="name" value={form.name} onChange={updateField} />
      </FormField>

      <FormField
        label={t("customers_form_phone")}
        hint={phoneLocked ? t("customers_form_phone_locked") : undefined}
      >
        <div className={phoneLocked ? "locked-input" : undefined}>
          {phoneLocked ? <span aria-hidden="true">🔒</span> : null}
          <input
            required
            name="phone"
            value={form.phone}
            onChange={updateField}
            disabled={phoneLocked}
            placeholder="+90 5__ ___ __ __"
          />
        </div>
      </FormField>

      <FormField label={t("customers_form_email")}>
        <input required type="email" name="email" value={form.email} onChange={updateField} />
      </FormField>

      <div className="form-two-columns">
        <FormField label={t("customers_form_line_type")}>
          <select name="lineType" value={form.lineType} onChange={updateField}>
            <option value="Faturalı">{tv("Faturalı")}</option>
            <option value="Faturasız">{tv("Faturasız")}</option>
          </select>
        </FormField>

        <FormField label={t("customers_form_city")}>
          <select name="city" value={form.city} onChange={updateField}>
            {cities.map((city) => (
              <option key={city} value={city}>
                {tv(city)}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label={t("customers_form_package")}>
        <input required name="packageName" value={form.packageName} onChange={updateField} />
      </FormField>

      <FormField label={t("customers_form_tag")}>
        <select name="tag" value={form.tag} onChange={updateField}>
          {tagOptions.map((option) => (
            <option key={option} value={option}>
              {tv(option)}
            </option>
          ))}
        </select>
      </FormField>

      <div className="inline-actions">
        <Button onClick={onCancel} disabled={submitting}>
          {t("button_cancel")}
        </Button>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? t("customers_form_saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}
