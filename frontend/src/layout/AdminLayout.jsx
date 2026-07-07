import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { useLanguage } from "../context/LanguageContext";

export default function AdminLayout({ onLogout }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar onLogout={() => setLogoutOpen(true)} />
        <div className="topbar-divider" />
        <Outlet />
      </main>

      <Modal
        open={logoutOpen}
        title={t("logout_modal_title")}
        subtitle={t("logout_modal_subtitle")}
        onClose={() => setLogoutOpen(false)}
        width="440px"
        footer={
          <>
            <Button onClick={() => setLogoutOpen(false)}>{t("button_cancel")}</Button>
            <Button variant="primary" onClick={onLogout}>
              {t("logout_confirm")}
            </Button>
          </>
        }
      >
        <p className="muted-copy">{t("logout_modal_note")}</p>
      </Modal>
    </div>
  );
}
