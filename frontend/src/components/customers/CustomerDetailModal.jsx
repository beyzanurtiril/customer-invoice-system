/*
  COMPONENT: CustomerDetailModal

  Müşteri detay içeriğini Modal componenti içinde gösterir.
  Alt bölümde Sil, Güncelle ve Kapat butonları bulunur.

  Akış:
  - customer doluysa modal açılır.
  - Güncelle -> onEdit
  - Sil -> onDelete
  - Kapat/X -> onClose

  TASARIM:
  - Modal dış görünümü: customers.css -> `.modal`
  - Footer buton yerleşimi: customers.css -> `.modal__footer`
  - Buton renkleri: ui.css
  - İçerik: CustomerDetail.jsx ve customers.css
*/

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CustomerDetail from "./CustomerDetail";

export default function CustomerDetailModal({ customer, onClose, onEdit, onDelete }) {
  return (
    <Modal
      // Seçili müşteri varsa modal açık kabul edilir.
      open={Boolean(customer)}
      // Müşteri henüz yoksa güvenli bir varsayılan başlık kullanılır.
      title={customer?.name ?? "Müşteri detayı"}
      subtitle={customer ? `Müşteri #${customer.id} · Son güncelleme bugün 14:32` : ""}
      onClose={onClose}
      width="640px"
      // footer propuna JSX verilerek Modalın alt buton alanı doldurulur.
      footer={
        <>
          <Button variant="dangerGhost" onClick={onDelete}>
            Sil
          </Button>
          <Button onClick={onEdit}>✎ Güncelle</Button>
          <Button variant="primary" onClick={onClose}>
            Kapat
          </Button>
        </>
      }
    >
      {/* Detayın asıl içeriği ayrı componentte tutulur. */}
      <CustomerDetail customer={customer} />
    </Modal>
  );
}
