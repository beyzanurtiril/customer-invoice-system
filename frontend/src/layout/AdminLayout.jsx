import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

export default function AdminLayout({ onLogout }) {
  const [logoutOpen, setLogoutOpen] = useState(false);

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
        title="Çıkış yapmak istiyor musun?"
        subtitle="Açık oturum kapatılacak ve giriş ekranına yönlendirileceksin."
        onClose={() => setLogoutOpen(false)}
        width="440px"
        footer={
          <>
            <Button onClick={() => setLogoutOpen(false)}>Vazgeç</Button>
            <Button variant="primary" onClick={onLogout}>
              Çıkış yap
            </Button>
          </>
        }
      >
        <p className="muted-copy">Kaydedilmemiş ekran filtreleri sıfırlanabilir.</p>
      </Modal>
    </div>
  );
}
