/*
  COMPONENT: ActiveFilterChips

  Müşteriler sayfasında arama/filtre sonucunun hemen altında görünen
  aktif filtre chiplerini ve toplam sonuç sayısını gösterir.

  Bu component kendi içinde filtre state'i tutmaz.
  Filtreleri hangi sayfanın yönettiğini bulmak için bu componenti kullanan
  CustomersPage.jsx dosyasındaki `chips`, `onRemove` ve `onClear` proplarına bak.

  TASARIM:
  - Ana satır: customers.css -> `.active-filters`
  - Filtre chipleri: customers.css -> `.filter-chip`
  - Temizle butonu: customers.css -> `.clear-button`
  - Sonuç sayısı: customers.css -> `.result-count`
*/

// Props:
// chips       -> Ekranda gösterilecek aktif filtre isimleri.
// resultCount -> Filtreleme sonunda kalan müşteri sayısı.
// onRemove    -> Tek bir chip kaldırıldığında çalışacak fonksiyon.
// onClear     -> Bütün aktif filtreler temizlendiğinde çalışacak fonksiyon.
export default function ActiveFilterChips({ chips, resultCount, onRemove, onClear }) {
  return (
    <div className="active-filters">
      <span>Aktif filtreler:</span>
      {/* Her filtre adı için ayrı bir chip butonu oluşturulur. */}
      {chips.map((chip) => (
        <button
          // React listelerinde her elemanın benzersiz bir key değeri olmalıdır.
          key={chip}
          className="filter-chip"
          // Hangi chip'e basıldığını üst component'e gönderir.
          onClick={() => onRemove(chip)}
        >
          {chip} <span>×</span>
        </button>
      ))}

      {/*
        En az bir aktif filtre varsa "Temizle" butonu gösterilir.
        chips.length 0 olduğunda bu bölüm hiç render edilmez.
      */}
      {chips.length ? (
        <button className="clear-button" onClick={onClear}>
          Temizle
        </button>
      ) : null}
      {/* `margin-left: auto` CSS'i sayesinde sonuç sayısı satırın sağına gider. */}
      <span className="result-count">{resultCount} sonuç</span>
    </div>
  );
}
