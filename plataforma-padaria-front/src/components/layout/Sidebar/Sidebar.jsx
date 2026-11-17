import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({
  items = [],
  collapsed = false,
  mobileOpen = false,
  onToggleCollapsed,
}) {
  const sidebarClassName = [
    "app-sidebar",
    collapsed ? "app-sidebar--collapsed" : "",
    mobileOpen ? "app-sidebar--mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={sidebarClassName} aria-label="Navegação principal">
      <div className="app-sidebar__header">
        <span className="app-sidebar__section-label">Menu principal</span>
        <button
          type="button"
          className="app-sidebar__collapse-button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
        </button>
      </div>

      <nav className="app-sidebar__navigation">
        {items.map((item) => {
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                className="app-sidebar__link app-sidebar__link--disabled"
                key={item.to}
                aria-disabled="true"
                title={`${item.label} — ${item.disabledReason || "Em desenvolvimento"}`}
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                <span className="app-sidebar__label">{item.label}</span>
                <span className="app-sidebar__coming-soon">Em breve</span>
              </div>
            );
          }

          return (
            <NavLink
              className={({ isActive }) =>
                `app-sidebar__link ${isActive ? "app-sidebar__link--active" : ""}`
              }
              to={item.to}
              end={item.end}
              key={item.to}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              <span className="app-sidebar__label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="app-sidebar__footer">
        <Link
          className="app-sidebar__link app-sidebar__logout"
          to="/login"
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut size={20} strokeWidth={1.8} aria-hidden="true" />
          <span className="app-sidebar__label">Sair</span>
        </Link>
      </div>
    </aside>
  );
}
