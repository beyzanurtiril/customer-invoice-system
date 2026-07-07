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
import { useLanguage } from "../context/LanguageContext";

export default function LoginPage({ onLogin }) {
  const { t } = useLanguage();

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
              {t("brand_sub_line_1")}
              <br />
              {t("brand_sub_line_2")}
            </span>
          </div>

          <div className="login-welcome-copy">
            <h1>
              {t("login_title_line_1")}
              <br />
              {t("login_title_line_2")}
            </h1>
            <p>{t("login_description")}</p>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-form-card" onSubmit={handleSubmit}>
          <div className="login-form-heading">
            <h2>{t("login_heading")}</h2>
            <p>{t("login_subtitle")}</p>
          </div>

          <div className="login-fields">
            <label className="login-field">
              <span>{t("login_email_label")}</span>
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
                <span>{t("login_password_label")}</span>
                <button type="button" className="login-forgot-button">
                  {t("login_forgot_password")}
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
            {t("login_submit")}
          </Button>
        </form>
      </section>
    </main>
  );
}
