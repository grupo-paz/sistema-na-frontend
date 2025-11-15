import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { authStorage } from "../../services";
import logoImage from '../../assets/na.jpeg'; // A importação correta

import "./stylesheets/admin-header.css";

export function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authStorage.getAccessToken();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
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

        <div className="admin-header-logo" onClick={() => navigate("/")}>
          {/* CORREÇÃO: Usamos o logoImage importado como a fonte da imagem */}
          <img src={logoImage} alt="Logo GrupoPaz" className="admin-header-logo-img" />
        </div>

        <nav className={`admin-header-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated && location.pathname.includes("/admin") && (
            <>
              <button
                className={`admin-header-btn admin-header-btn-secondary ${location.pathname === "/admin/perfil" || location.pathname === "/admin" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/perfil")}
              >
                Perfil
              </button>
              <button
                className={`admin-header-btn admin-header-btn-secondary ${location.pathname === "/admin/administradores" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/administradores")}
              >
                Administradores
              </button>
              <button
                className={`admin-header-btn admin-header-btn-secondary ${location.pathname === "/admin/secretaria" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/secretaria")}
              >
                Secretaria
              </button>
              <button
                className={`admin-header-btn admin-header-btn-secondary ${location.pathname === "/admin/eventos" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/eventos")}
              >
                Eventos
              </button>
              <button
                className={`admin-header-btn admin-header-btn-secondary ${location.pathname === "/admin/reunioes" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/reunioes")}
              >
                Reuniões
              </button>
              <button
                className="admin-header-btn admin-header-btn-secondary"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
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
