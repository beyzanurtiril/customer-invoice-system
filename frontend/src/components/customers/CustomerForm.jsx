/*
  COMPONENT: CustomerForm

  Hem yeni müşteri ekleme hem de var olan müşteriyi güncelleme
  ekranında kullanılan ortak formdur.

  AddCustomerModal:
  - initialValues göndermez.
  - Form boş değerlerle açılır.
  - Telefon değiştirilebilir.

  UpdateCustomerModal:
  - initialValues olarak seçili müşteriyi gönderir.
  - phoneLocked gönderir.
  - Telefon inputu kilitlenir.

  TASARIM:
  - Form düzeni: customers.css -> `.modal-form-grid`
  - İki kolon: `.form-two-columns`
  - Form alanları: `.form-field`
  - Kilitli telefon: `.locked-input`
  - Alt butonlar: `.inline-actions`
  - Buton görünümü: ui.css
*/

import { useState } from "react";
import Button from "../ui/Button";
import FormField from "../ui/FormField";
import { getTagOptions } from "../../utils/customerFilter";

// Yeni müşteri formu açıldığında kullanılacak başlangıç değerleri.
const defaultValues = {
  /*db ile kesinleşir*/
  name: "",
  phone: "",
  email: "",
  lineType: "Faturalı",
  city: "İstanbul",
  packageName: "İnternet 30 GB",
  tag: "Güvenilir",
};

const cities = ["İstanbul", "Ankara", "İzmir", "Antalya", "Trabzon"]; /*silincek*/
// Props:
// initialValues -> Güncelleme formunda mevcut müşteri bilgileri.
// phoneLocked   -> true ise telefon değiştirilemez.
// submitLabel   -> Ana butonda görünen yazı.
// submitting    -> İşlem devam ederken butonları kilitler.
// onCancel      -> İptal butonunda çalışır.
// onSubmit      -> Formun son verisini üst componente gönderir.
export default function CustomerForm({
  initialValues = defaultValues,
  phoneLocked = false,
  submitLabel,
  submitting = false,
  onCancel,
  onSubmit,
}) {
  /*
    Formun bütün alanlarını tek obje state'inde tutuyoruz.

    Önce defaultValues, sonra initialValues yayılır.
    Aynı alan initialValues içinde varsa müşteriden gelen değer kazanır.

    Örnek:
    default city = İstanbul
    initialValues.city = Ankara
    sonuç city = Ankara

    DİKKAT:
    useState başlangıç değerini yalnızca component ilk oluşturulurken kullanır.
    Aynı form componenti kapanmadan farklı müşteriyle tekrar kullanılacaksa
    initialValues değişimini useEffect ile takip etmek gerekebilir.
  */
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });
  const tagOptions = getTagOptions(form.lineType, false);

  /*
    Bütün input ve selectlerin ortak onChange fonksiyonu.

    Çalışabilmesi için input/select üzerinde:
    - name="..."
    - value={form....}
    - onChange={updateField}
    bulunmalıdır.
  */

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

  // Form gönderildiğinde sayfanın yenilenmesini engeller
  // ve güncel form bilgilerini modalın onSubmit fonksiyonuna gönderir.
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="modal-form-grid" onSubmit={handleSubmit}>
      <FormField label="Ad soyad">
        {/*
          Bu controlled inputtur:
          Görünen değer `form.name` state'inden gelir.
          Kullanıcı yazdıkça updateField state'i günceller.
        */}
        <input required name="name" value={form.name} onChange={updateField} />
      </FormField>

      <FormField
        label="Telefon"
        // Telefon kilitliyse inputun altında açıklama gösterilir.
        hint={
          phoneLocked
            ? "Telefon numarası hat taşıma/devir süreci nedeniyle bu ekrandan değiştirilemez."
            : undefined
        }
      >
        {/*
          phoneLocked true olduğunda CSS için `locked-input` classı eklenir.
          False olduğunda className undefined olur ve normal input görünür.
        */}

        <div className={phoneLocked ? "locked-input" : undefined}>
          {/* Kilit ikonu sadece güncelleme modunda görünür. */}
          {phoneLocked ? <span aria-hidden="true">🔒</span> : null}
          <input
            required
            name="phone"
            value={form.phone}
            onChange={updateField}
            // disabled olduğu için kullanıcı telefon değerini değiştiremez.
            disabled={phoneLocked}
            placeholder="+90 5__ ___ __ __"
          />
        </div>
      </FormField>

      <FormField label="E-posta">
        <input required type="email" name="email" value={form.email} onChange={updateField} />
      </FormField>

      {/* Hat tipi ve şehir CSS sayesinde iki sütun halinde görünür. */}
      <div className="form-two-columns">
        <FormField label="Hat tipi">
          <select name="lineType" value={form.lineType} onChange={updateField}>
            <option>Faturalı</option>
            <option>Faturasız</option>
          </select>
        </FormField>

        <FormField label="Şehir">
          <select name="city" value={form.city} onChange={updateField}>
            {/* cities array'indeki her şehir için option üretir. */}
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Paket">
        <input required name="packageName" value={form.packageName} onChange={updateField} />
      </FormField>

      <FormField label="Etiket">
        <select name="tag" value={form.tag} onChange={updateField}>
          {tagOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>

      {/* Formun sağ altındaki İptal ve Kaydet butonları. */}
      <div className="inline-actions">
        <Button
          // Bu buton form submit etmemelidir.
          // Button componentinin varsayılan type'ı kontrol edilmelidir.
          onClick={onCancel}
          disabled={submitting}
        >
          İptal
        </Button>
        <Button variant="primary" type="submit" disabled={submitting}>
          {/*
            İşlem devam ederken kullanıcıya durum gösterilir.
            Aynı zamanda disabled olduğu için tekrar tekrar gönderilemez.
          */}
          {submitting ? "Kaydediliyor…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
