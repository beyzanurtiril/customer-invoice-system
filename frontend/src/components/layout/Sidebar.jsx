/*
  COMPONENT: Sidebar

  Uygulamanın sol menüsünü ve sayfa linklerini oluşturur.
  Yeni bir menü eklemek için navItems array'ine yeni obje eklenir.

  TASARIM:
  layout.css -> `.sidebar`, `.sidebar-link`, `.sidebar-link--active`, `.brand`
*/

import { NavLink } from "react-router-dom";
import { ChartIcon, GearIcon, HomeIcon, InvoiceIcon, PinIcon, UsersIcon } from "./Icons";

// to: gidilecek route, label: ekrandaki yazı, icon: kullanılacak SVG componenti.
const navItems = [
  { to: "/", label: "Ana sayfa", icon: HomeIcon, end: true },
  { to: "/customers", label: "Müşteriler", icon: UsersIcon },
  { to: "/invoices", label: "Faturalar", icon: InvoiceIcon },
  { to: "/analytics", label: "Analizler", icon: ChartIcon },
  { to: "/regional", label: "Bölgesel", icon: PinIcon },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <strong>PiA</strong>
        <span className="brand__divider" />
        <span>
          People
          <br />
          in Action
        </span>
      </div>

      <nav className="sidebar__nav" aria-label="Ana navigasyon">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            // `end`, ana sayfa linkinin diğer tüm route'larda aktif görünmesini engeller.
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? " sidebar-link--active" : ""}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* CSS'teki margin-top: auto sayesinde Ayarlar en alta gider. */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `sidebar-link sidebar-link--settings${isActive ? " sidebar-link--active" : ""}`
        }
      >
        <GearIcon />
        <span>Ayarlar</span>
      </NavLink>
    </aside>
  );
}
