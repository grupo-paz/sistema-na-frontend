import { useNavigate, useLocation } from "react-router-dom";
import { authStorage } from "../services/api";
import "../stylesheets/Header.css";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authStorage.getAccessToken();

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
  };

  const handlePasswordRecovery = () => {
    console.log("Recuperar senha");
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <h1>GrupoPaz</h1>
        </div>
        
        <div className="header-actions">
          {!isAuthenticated && location.pathname === "/login" && (
            
              <button 
                className="header-btn header-btn-primary"
                onClick={handlePasswordRecovery}
              >
                Recuperar Senha
              </button>
            
          )}
          
          {isAuthenticated && location.pathname.includes("/admin") && (
            <>
            <button 
              className="header-btn header-btn-secondary"
              onClick={handleLogout}
            >
              Sair
            </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}