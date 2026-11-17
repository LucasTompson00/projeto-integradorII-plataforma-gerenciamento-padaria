import { Menu } from "lucide-react";
import logoGava from "../../../assets/icons/icon_gava.png";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import "./Topbar.css";

export default function Topbar({ areaLabel, pageTitle, area, onMenuClick }) {
  return (
    <header className="app-topbar">
      <button
        type="button"
        className="app-topbar__menu-button"
        onClick={onMenuClick}
        aria-label="Abrir menu de navegação"
      >
        <Menu size={22} />
      </button>

      <div className="app-topbar__brand" aria-label="Panificadora Gava">
        <img className="app-topbar__logo" src={logoGava} alt="" />
        <span className="app-topbar__brand-name">Panificadora Gava</span>
      </div>

      <span className="app-topbar__separator" aria-hidden="true" />

      <div className="app-topbar__page-context">
        <span className="app-topbar__area-label">{areaLabel}</span>
        <span className="app-topbar__page-title">{pageTitle}</span>
      </div>

      <div className="app-topbar__actions">
        <ProfileDropdown area={area} />
      </div>
    </header>
  );
}
