import { useState } from "react";
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
