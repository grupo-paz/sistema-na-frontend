import { useState } from "react";
import { ConfirmModalOptions, Header, Loading, withConfirmModal } from "../../../components";
import { forgotAdminPassword } from "../../../services/auth";
import { useNavigate } from "react-router-dom";

import "./stylesheets/admin-forgot-password.css";

const AdminForgotPassword: React.FC<{ showConfirm: (options: ConfirmModalOptions) => void }> = ({ showConfirm }) => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        error: false,
        text: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ error: false, text: "" });
        if (!email) {
            setMessage({ error: true, text: "Email é obrigatório." });
            return;
        }
        setLoading(true);
        try {
            const response = await forgotAdminPassword(email);

            showConfirm({
                title: "Recuperação de senha enviada com sucesso",
                message: response.message + " Clique para voltar ao login.",
                confirmText: "Confirmar",
                onConfirm: () => { navigate("/admin/login") },
                oneButton: true,
            });
        } catch (err: any) {
            setMessage({ error: true, text: "Erro ao alterar senha. " + JSON.parse(err.message).issues[0]?.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <Header />
            <div className="page-content">
                <div className="admin-forgot-password">
                    <div className="admin-forgot-password-header">
                        <h1>Recuperar a senha</h1>
                    </div>
                    <div className="admin-forgot-password-content">
                        <p className="admin-forgot-password-text">Insira seu email para receber instruções de recuperação de senha.</p>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="buttons">
                                <button type="submit" disabled={loading} className="save-btn">
                                    {loading ? "Enviando..." : "Enviar"}
                                </button>
                                <button type="button" disabled={loading} className="cancel-btn" onClick={() => navigate("/admin/login")}>
                                    Cancelar
                                </button>
                            </div>
                            {message?.text && <p className={message.error ? "form-message-error" : "form-message-success"}>{message.text}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withConfirmModal(AdminForgotPassword);