/*
  COMPONENT: Topbar

  Sağ üstte admin bilgisini ve çıkış butonunu gösterir.
  Gerçek kullanıcı bilgileri backend/auth sisteminden geldiğinde
  name, role ve initials değerleri prop yapılabilir.

  TASARIM:
  layout.css -> `.topbar`, `.topbar__account`, `.avatar`
*/

import Button from "../ui/Button";

export default function Topbar({ onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar__account">
        <div className="avatar">AD</div>
        <div>
          <strong>Admin</strong>
          <span>Sistem yöneticisi</span>
        </div>
      </div>

      {/* Çıkış mantığı bu componentte değil, onLogout propunun geldiği üst katmandadır. */}
      <Button onClick={onLogout}>Çıkış yap →</Button>
    </header>
  );
}
