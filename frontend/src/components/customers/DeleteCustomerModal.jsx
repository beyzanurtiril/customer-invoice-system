/*
  COMPONENT: DeleteCustomerModal

  Bir müşteriyi silmeden önce kullanıcıdan son onayı alır.
  Modalda müşteri adı, ID ve telefon bilgisi gösterilir.

  Bu component silme işlemini doğrudan yapmaz.
  "Müşteriyi sil" butonu `onConfirm` propunu çağırır.
  Gerçek silme isteği CustomersPage.jsx/useCustomers tarafında yapılır.

  TASARIM:
  - Modal: customers.css -> `.modal`
  - Müşteri bilgi kutusu: `.delete-confirmation`
  - Kırmızı buton: ui.css -> `.button--danger`
*/

import Button from "../ui/Button";
import Modal from "../ui/Modal";
// customer  -> Silinecek müşteri. null ise modal kapalıdır.
// deleting  -> Silme isteği devam ederken true.
// onClose   -> Vazgeç veya X ile modalı kapatır.
// onConfirm -> Gerçek silme işlemini başlatır.
export default function DeleteCustomerModal({ customer, deleting, onClose, onConfirm }) {
  return (
    <Modal
      open={Boolean(customer)}
      title="Müşteriyi silmek istiyor musun?"
      subtitle="Bu işlem geri alınamaz."
      onClose={onClose}
      width="460px"
      footer={
        <>
          <Button onClick={onClose} disabled={deleting}>
            Vazgeç
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={deleting}>
            {/*
              Silme sürerken buton yazısı değişir ve disabled olur.
              Böylece kullanıcı aynı isteği birden fazla kez gönderemez.
            */}
            {deleting ? "Siliniyor…" : "Müşteriyi sil"}
          </Button>
        </>
      }
    >
      {/*
        customer varsa bilgi kutusu oluşturulur.
        Optional alanlara doğrudan erişmeden önce bu kontrol yapılır.
      */}
      {customer ? (
        <div className="delete-confirmation">
          <strong>{customer.name}</strong>
          <span>Müşteri #{customer.id}</span>
          <span>{customer.phone}</span>
        </div>
      ) : null}
    </Modal>
  );
}
