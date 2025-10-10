import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { authStorage } from "../../services/api";

import "./stylesheets/header.css";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authStorage.getAccessToken();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handlePasswordRecovery = () => {
    console.log("Recuperar senha");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        {isAuthenticated && location.pathname.includes("/admin") && (
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        )}

        <div className="header-logo">
          <h1>Grupo<b>Paz</b></h1>
        </div>

        <nav className={`header-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated && location.pathname.includes("/admin") && (
            <>
              <button
                className={`header-btn header-btn-secondary ${location.pathname === "/admin/perfil" || location.pathname === "/admin" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/perfil")}
              >
                Perfil
              </button>
              <button
                className={`header-btn header-btn-secondary ${location.pathname === "/admin/administradores" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/administradores")}
              >
                Administradores
              </button>
              <button
                className="header-btn header-btn-secondary"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          )}
          {!isAuthenticated && location.pathname === "/login" && (
            <button
              className="header-btn"
              onClick={handlePasswordRecovery}
            >
              Recuperar Senha
            </button>
          )}
        </nav>

        {isMobileMenuOpen && (
          <button
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></button>
        )}
      </div>
    </header>
  );
}