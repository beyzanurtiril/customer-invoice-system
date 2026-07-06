/*
  COMPONENT: CustomerToolbar

  Müşteriler sayfasının üstündeki:
  - Arama kutusu
  - Filtreler butonu
  - Müşteri ekle butonu
  alanını oluşturur.

  Arama state'i bu componentte tutulmaz.
  `search` değeri ve `onSearch` fonksiyonu CustomersPage.jsx'ten gelir.

  TASARIM:
  - Toolbar satırı: customers.css -> `.customer-toolbar`
  - Arama inputu: customers.css -> `.customer-toolbar input`
  - Butonlar: ui.css
*/

import Button from "../ui/Button";
// search        -> Arama kutusunun mevcut değeri.
// onSearch      -> Kullanıcı yazdığında yeni değeri üst componente yollar.
// onOpenFilters -> Gelişmiş filtre modalını açar.
// onAddCustomer -> Yeni müşteri modalını açar.
export default function CustomerToolbar({ search, onSearch, onOpenFilters, onAddCustomer }) {
  return (
    <div className="customer-toolbar">
      <input
        // Controlled input: görünen değer üst componentteki search state'inden gelir.
        value={search}
        // Her tuşta inputun yeni metnini üst componente gönderir.
        onChange={(event) => onSearch(event.target.value)}
        placeholder="İsim, ID veya telefon ara"
        aria-label="Müşteri ara"
      />
      <Button onClick={onOpenFilters}>Filtreler</Button>
      <Button variant="primary" onClick={onAddCustomer}>
        + Müşteri ekle
      </Button>
    </div>
  );
}
