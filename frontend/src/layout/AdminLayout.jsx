import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { useLanguage } from "../context/LanguageContext";

export default function AdminLayout({ onLogout }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  // Mobil ekranda sidebar'ın açık/kapalı çekmece durumunu tutar; masaüstünde kullanılmaz.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="app-shell">
      <Sidebar open={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />
      {/* Mobilde menü açıkken arkasına tıklayınca kapatan karartma katmanı. */}
      {mobileNavOpen ? (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <main className="main-area">
        <Topbar
          onLogout={() => setLogoutOpen(true)}
          onMenuToggle={() => setMobileNavOpen((value) => !value)}
        />
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
