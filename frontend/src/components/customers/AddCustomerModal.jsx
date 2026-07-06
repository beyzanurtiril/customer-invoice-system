/*
  COMPONENT: AddCustomerModal

  Yeni müşteri ekleme modalını oluşturur.
  Modalın dış çerçevesini `Modal`, form alanlarını ise `CustomerForm` yönetir.

  Bu component müşteri ekleme işlemini kendisi yapmaz.
  Form gönderildiğinde `onSubmit` propunu çağırır; asıl ekleme işlemi
  CustomersPage.jsx veya useCustomers hook'unda yapılır.

  TASARIM:
  - Modal görünümü: customers.css -> `.modal`, `.modal-backdrop`
  - Form görünümü: customers.css -> `.modal-form-grid`, `.form-field`
  - Butonlar: ui.css -> `.button`, `.button--primary`
*/

import CustomerForm from "./CustomerForm";
import Modal from "../ui/Modal";

// Props:
// open       -> Modalın açık olup olmadığını belirler.
// submitting -> Ekleme isteği devam ederken butonları pasifleştirir.
// onClose    -> Modalı kapatır.
// onSubmit   -> Formdaki yeni müşteri verisini üst component'e gönderir.

export default function AddCustomerModal({ open, submitting, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      title="Yeni müşteri"
      subtitle="Temel müşteri ve hat bilgilerini gir."
      onClose={onClose}
    >
      {/*
        initialValues verilmediği için CustomerForm kendi boş başlangıç
        değerlerini kullanır. Telefon alanı da kilitli değildir.
      */}

      <CustomerForm
        submitLabel="Müşteriyi ekle"
        submitting={submitting}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
