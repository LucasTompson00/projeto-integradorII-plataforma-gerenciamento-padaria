import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import { navigationByArea } from "../../../config/navigation";

const pageTitles = {
  "/home": "Início",
  "/pedidos": "Meus pedidos",
  "/perfil": "Meu perfil",
  "/admin/pedidos": "Gerenciamento de pedidos",
  "/admin/produtos": "Produtos",
  "/admin/estoque": "Estoque",
};

export default function AppLayout({ area = "cliente" }) {
  const { pathname } = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const areaLabel = area === "admin" ? "Área administrativa" : "Área do cliente";
  const pageTitle = pageTitles[pathname] || "Sistema de gerenciamento";
  const navigationItems = navigationByArea[area] || navigationByArea.cliente;

  // Em tablets, iniciamos com a navegação compacta. Em desktop, ela começa expandida.
  useEffect(() => {
    const tabletQuery = window.matchMedia("(min-width: 761px) and (max-width: 1024px)");
    const updateForViewport = (event) => setSidebarCollapsed(event.matches);

    setSidebarCollapsed(tabletQuery.matches);

    if (tabletQuery.addEventListener) {
      tabletQuery.addEventListener("change", updateForViewport);
      return () => tabletQuery.removeEventListener("change", updateForViewport);
    }

    tabletQuery.addListener(updateForViewport);
    return () => tabletQuery.removeListener(updateForViewport);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const layoutClassName = [
    "app-layout",
    `app-layout--${area}`,
    sidebarCollapsed ? "app-layout--collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={layoutClassName}>
      <a className="app-layout__skip-link" href="#app-layout-content">
        Ir para o conteúdo
      </a>

      <Topbar
        areaLabel={areaLabel}
        pageTitle={pageTitle}
        area={area}
        onMenuClick={() => setMobileNavOpen(true)}
      />

      <Sidebar
        items={navigationItems}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileNavOpen}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
      />

      {mobileNavOpen && (
        <button
          type="button"
          className="app-layout__scrim"
          aria-label="Fechar menu de navegação"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className="app-layout__content" id="app-layout-content">
        <Outlet />
      </div>
    </div>
  );
}
