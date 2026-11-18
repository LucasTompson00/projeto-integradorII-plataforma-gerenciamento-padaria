import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import "./ProfileDropdown.css";

export default function ProfileDropdown({ area = "cliente" }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const accountLabel = area === "admin" ? "Equipe Gava" : "Minha conta";

  useEffect(() => {
    function handlePointerDown(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="app-profile" ref={dropdownRef}>
      <button
        type="button"
        className="app-profile__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir menu do perfil"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="app-profile__avatar" aria-hidden="true">
          <UserRound size={19} />
        </span>
        <span className="app-profile__name">{accountLabel}</span>
        <ChevronDown className={open ? "is-open" : ""} size={16} />
      </button>

      {open && (
        <div className="app-profile__menu" role="menu">
          <div className="app-profile__menu-heading">
            <strong>{accountLabel}</strong>
            <span>{area === "admin" ? "Área administrativa" : "Área do cliente"}</span>
          </div>

          {area === "cliente" && (
            <Link
              className="app-profile__menu-item"
              to="/perfil"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <UserRound size={17} />
              Meu perfil
            </Link>
          )}

          <Link
            className="app-profile__menu-item app-profile__menu-item--danger"
            to="/login"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <LogOut size={17} />
            Sair
          </Link>
        </div>
      )}
    </div>
  );
}
