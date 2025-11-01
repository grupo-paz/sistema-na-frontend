import "./stylesheets/footer.css";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Mapa do Site</h3>
                        <ul className="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/secretaria">Secretaria</a></li>
                            <li><a href="/eventos">Eventos</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Links Institucionais</h3>
                        <ul className="footer-links">
                            <li>
                                <a 
                                    href="https://www.na.org.br/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Site Oficial - Narcóticos Anônimos
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 Grupo Paz Narcóticos Anônimos. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};