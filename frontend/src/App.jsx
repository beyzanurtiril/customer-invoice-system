import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AnalyticsPage from "./pages/AnalyticsPage";
import CustomersPage from "./pages/CustomersPage";
import DashboardPage from "./pages/DashboardPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import RegionalPage from "./pages/RegionalPage";
import SettingsPage from "./pages/SettingsPage";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

/*
  Login durumu daha önce sadece React state'indeydi; sayfa yenilenince veya
  5173'e geri dönülünce state sıfırlanıp kullanıcı login ekranına düşüyordu.
  Artık oturum bilgisi sessionStorage'da tutulur: sekme açık kaldığı sürece
  giriş korunur, sekme/tarayıcı kapatılınca otomatik temizlenir.
  (Kalıcı "beni hatırla" istenirse sessionStorage yerine localStorage kullanın.)
*/
const AUTH_STORAGE_KEY = "pia-auth";

function getInitialLoginState() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(AUTH_STORAGE_KEY) === "1";
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoginState);

  useEffect(() => {
    if (isLoggedIn) {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, "1");
    } else {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [isLoggedIn]);

  // Dil ve tema tercihleri, giriş ekranı dahil bütün uygulamayı sarmalar.
  return (
    <ThemeProvider>
      <LanguageProvider>
        {isLoggedIn ? (
          <Routes>
            <Route element={<AdminLayout onLogout={() => setIsLoggedIn(false)} />}>
              <Route index element={<DashboardPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="regional" element={<RegionalPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <LoginPage onLogin={() => setIsLoggedIn(true)} />
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}
