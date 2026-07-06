/*
  COMPONENT: UpdateCustomerModal

  Seçilen müşterinin bilgilerini güncellemek için kullanılan modaldır.
  AddCustomerModal ile aynı CustomerForm componentini kullanır;
  fakat başlangıç değerlerini müşteri objesinden verir ve telefonu kilitler.

  Akış:
  - customer varsa modal açılır.
  - CustomerForm mevcut bilgilerle dolar.
  - Telefon değiştirilemez.
  - Kaydet -> onSubmit
  - İptal/X -> onClose

  TASARIM:
  - Modal: customers.css -> `.modal`
  - Form: CustomerForm.jsx ve customers.css
  - Kilitli telefon: customers.css -> `.locked-input`
*/

import CustomerForm from "./CustomerForm";
import Modal from "../ui/Modal";
// customer   -> Güncellenecek müşteri.
// submitting -> Güncelleme isteği devam ediyor mu?
// onClose    -> Modalı kapatır.
// onSubmit   -> Güncellenmiş form verisini üst componente gönderir.
export default function UpdateCustomerModal({ customer, submitting, onClose, onSubmit }) {
  return (
    <Modal
      // Müşteri seçilmeden güncelleme modalı açılmaz.
      open={Boolean(customer)}
      title="Müşteriyi güncelle"
      subtitle={customer ? `${customer.name} · Müşteri #${customer.id}` : ""}
      onClose={onClose}
    >
      {customer ? (
        <CustomerForm
          // Form alanlarını seçili müşterinin mevcut değerleriyle doldurur.
          key={customer.id}
          initialValues={customer}
          // Boolean prop kısa yazımı: phoneLocked={true} ile aynıdır.
          phoneLocked
          submitLabel="Değişiklikleri kaydet"
          submitting={submitting}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      ) : null}
    </Modal>
  );
}
