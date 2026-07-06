import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import CustomersPage from "./pages/CustomersPage";
import DashboardPage from "./pages/DashboardPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import PlaceholderPage from "./pages/PlaceholderPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout onLogout={() => setIsLoggedIn(false)} />}>
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="analytics" element={<PlaceholderPage title="Analizler" />} />
        <Route path="regional" element={<PlaceholderPage title="Bölgesel" />} />
        <Route path="settings" element={<PlaceholderPage title="Ayarlar" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
