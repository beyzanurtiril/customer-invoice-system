/*
  COMPONENT: CustomerActionsModal

  Tablodaki üç nokta butonuna basıldığında açılan işlem menüsüdür.
  Seçilen müşteri için detay açma, güncelleme ve silme seçeneklerini gösterir.

  Bu component hangi modalın açılacağını kendi başına belirlemez.
  Her buton, CustomersPage.jsx tarafından gönderilen callback'i çağırır.

  TASARIM:
  - Modal: customers.css -> `.modal`
  - Menü listesi: customers.css -> `.menu-list`
  - Menü butonları: customers.css -> `.menu-list button`
  - Kırmızı sil seçeneği: customers.css -> `.menu-list__danger`
*/

import Modal from "../ui/Modal";

// customer      -> İşlem yapılacak müşteri. null ise modal kapalıdır.
// onClose       -> İşlem menüsünü kapatır.
// onOpenDetail  -> Müşteri detay modalını açar.
// onEdit        -> Güncelleme modalını açar.
// onDelete      -> Silme onay modalını açar.

export default function CustomerActionsModal({
  customer,
  onClose,
  onOpenDetail,
  onEdit,
  onDelete,
}) {
  return (
    <Modal
      // Boolean(customer): müşteri varsa true, null/undefined ise false olur.
      open={Boolean(customer)}
      title="Müşteri işlemleri"
      // Optional chaining sayesinde customer yokken hata oluşmaz.
      subtitle={customer?.name}
      onClose={onClose}
      // Bu modal diğerlerinden daha dar görünür.
      width="360px"
    >
      <div className="menu-list">
        <button onClick={onOpenDetail}>Müşteri detayını aç</button>
        <button onClick={onEdit}>✎ Müşteriyi güncelle</button>

        {/* Silme seçeneğine kırmızı görünüm veren özel class.*/}
        <button className="menu-list__danger" onClick={onDelete}>
          Müşteriyi sil
        </button>
      </div>
    </Modal>
  );
}
