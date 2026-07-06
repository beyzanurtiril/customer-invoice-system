/*
  COMPONENT: CustomerFiltersModal

  "Filtreler" butonuna basıldığında açılan gelişmiş filtre modalıdır.

  ÖNEMLİ:
  Şu an "Filtreleri uygula" butonu yalnızca modalı kapatıyor.
  Form değerleri okunmuyor ve müşteri listesine uygulanmıyor.
  Gerçek filtreleme için bu componentte form state'i oluşturulmalı ve
  `onApply(filters)` benzeri bir prop kullanılmalıdır.

  TASARIM:
  - Modal: customers.css -> `.modal`
  - Form alanları: `.modal-form-grid`, `.form-field`
  - Butonlar: ui.css
*/

import Button from "../ui/Button";
import FormField from "../ui/FormField";
import Modal from "../ui/Modal";

export default function CustomerFiltersModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      title="Gelişmiş filtreler"
      subtitle="Müşteri listesini daha ayrıntılı kriterlerle daralt."
      onClose={onClose}
      footer={
        <>
          {/* Şu an iki buton da yalnızca modalı kapatır. */}
          <Button onClick={onClose}>Vazgeç</Button>
          <Button variant="primary" onClick={onClose}>
            Filtreleri uygula
          </Button>
        </>
      }
    >
      <div className="modal-form-grid">
        {/*
          FormField yalnızca label ve alan yerleşimini standartlaştırır.
          İçine verilen select/input gerçek form elemanıdır.
        */}
        <FormField label="Hat tipi">
          <select defaultValue="Faturalı">
            <option>Faturalı</option>
            <option>Faturasız</option>
          </select>
        </FormField>
        <FormField label="Etiket">
          <select defaultValue="Riskli">
            <option>Riskli</option>
            <option>Güvenilir</option>
          </select>
        </FormField>
        <FormField label="Şehir / bölge">
          <select defaultValue="Tümü">
            <option>Tümü</option>
            <option>İstanbul</option>
            <option>Ankara</option>
          </select>
        </FormField>
        <FormField label="Son 12 ay gecikme">
          <select defaultValue="3+ kez">
            <option>3+ kez</option>
            <option>Tümü</option>
          </select>
        </FormField>
        <FormField label="Aylık fatura aralığı">
          <input defaultValue="0 ₺ — 1.500 ₺" />
        </FormField>
      </div>
    </Modal>
  );
}
