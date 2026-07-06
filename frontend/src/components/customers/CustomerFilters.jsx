/*
  COMPONENT: CustomerFilters

  Müşteriler sayfasında sürekli görünen beşli filtre panelini oluşturur.

  ÖNEMLİ:
  Bu sürümde select alanları yalnızca görsel olarak bulunuyor.
  Seçilen değerler state'e bağlanmadığı için tabloyu gerçekten filtrelemez.
  Gerçek filtreleme eklemek için:
  - value
  - onChange
  - filtre state'i
  propları eklenmelidir.

  TASARIM:
  - Panel: customers.css -> `.filter-panel`
  - Başlıklar ve selectler: `.filter-panel label`, `.filter-panel select`
*/

// Her iç array:
// [ekranda görünen başlık, selectin başlangıç değeri]

import { getTagOptions } from "../../utils/customerFilter";

export default function CustomerFilters({ filters, onChange }) {
  const tagOptions = getTagOptions(filters.lineType);
  return (
    <div className="filter-panel">
      <label>
        <span>HAT TİPİ</span>
        <select
          value={filters.lineType}
          onChange={(event) => onChange("lineType", event.target.value)}
        >
          <option>Tümü</option>
          <option>Faturalı</option>
          <option>Faturasız</option>
        </select>
      </label>

      <label>
        <span>ETİKET</span>
        <select value={filters.tag} onChange={(event) => onChange("tag", event.target.value)}>
          {tagOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        <span>ŞEHİR / BÖLGE</span>
        <select value={filters.city} onChange={(event) => onChange("city", event.target.value)}>
          <option>Tümü</option>
        </select>
      </label>

      <label>
        <span>GECİKME (12 AY)</span>
        <select value={filters.delay} onChange={(event) => onChange("delay", event.target.value)}>
          <option>3+ kez</option>
          <option>Tümü</option>
        </select>
      </label>

      <label>
        <span>AYLIK FATURA</span>
        <select
          value={filters.monthlyInvoice}
          onChange={(event) => onChange("monthlyInvoice", event.target.value)}
        >
          <option>Tümü</option>
        </select>
      </label>
    </div>
  );
}
