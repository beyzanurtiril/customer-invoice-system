/*
  COMPONENT: CustomerDetailModal

  Müşteri detay içeriğini Modal componenti içinde gösterir.
*/

import { useLanguage } from "../../context/LanguageContext";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CustomerDetail from "./CustomerDetail";

export default function CustomerDetailModal({ customer, onClose, onEdit, onDelete }) {
  const { t } = useLanguage();

  return (
    <Modal
      open={Boolean(customer)}
      title={customer?.name ?? t("customers_detail_title_fallback")}
      subtitle={customer ? t("customers_detail_subtitle", { id: customer.id }) : ""}
      onClose={onClose}
      width="640px"
      footer={
        <>
          <Button variant="dangerGhost" onClick={onDelete}>
            {t("button_delete")}
          </Button>
          <Button onClick={onEdit}>{t("button_update")}</Button>
          <Button variant="primary" onClick={onClose}>
            {t("button_close")}
          </Button>
        </>
      }
    >
      <CustomerDetail customer={customer} />
    </Modal>
  );
}
