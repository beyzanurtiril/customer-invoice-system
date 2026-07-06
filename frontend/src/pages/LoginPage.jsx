/*
  PAGE: LoginPage

  Uygulama açıldığında kullanıcıdan yönetici bilgilerini alan tam ekran giriş sayfasıdır.
  Sol panel kurumsal kimliği, sağ panel giriş formunu gösterir.

  Şu an form gönderildiğinde App.jsx içindeki onLogin çalışır.
  Gerçek backend girişi eklendiğinde handleSubmit içinden auth service çağrılabilir.

  TASARIM:
  pages.css -> `.login-page`, `.login-brand-panel`, `.login-form-card` ve alt sınıflar
*/

import { useState } from "react";
import Button from "../components/ui/Button";

export default function LoginPage({ onLogin }) {
  // Inputları React state'ine bağlayarak kontrollü form oluşturuyoruz.
  const [form, setForm] = useState({
    email: "admin@pia-group.com",
    password: "",
  });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    // HTML formunun sayfayı yenilemesini engeller.
    event.preventDefault();

    // App.jsx içindeki login işlemini çalıştırır.
    onLogin(form);
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-brand-logo">
            <strong>PiA</strong>
            <span className="login-brand-divider" />
            <span>
              People
              <br />
              in Action
            </span>
          </div>

          <div className="login-welcome-copy">
            <h1>
              Yönetim Paneline
              <br />
              Hoş Geldin.
            </h1>
            <p>
              Müşteri yönetimi, senaryo bazlı fatura takibi ve gelişmiş bölgesel analizler için
              sisteme giriş yap.
            </p>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-form-card" onSubmit={handleSubmit}>
          <div className="login-form-heading">
            <h2>Hesabına Giriş Yap</h2>
            <p>Devam etmek için yönetici bilgilerini gir.</p>
          </div>

          <div className="login-fields">
            <label className="login-field">
              <span>E-POSTA ADRESİ</span>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
              />
            </label>

            <label className="login-field">
              <span className="login-password-label">
                <span>ŞİFRE</span>
                <button type="button" className="login-forgot-button">
                  Şifremi unuttum
                </button>
              </span>

              <input
                required
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
            </label>
          </div>

          <Button className="login-submit-button" variant="primary" type="submit">
            Giriş Yap
          </Button>
        </form>
      </section>
    </main>
  );
}
