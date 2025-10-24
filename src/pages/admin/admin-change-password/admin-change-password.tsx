import { useState } from "react";
import { ConfirmModalOptions, Header, Loading, withConfirmModal } from "../../../components";
import "./stylesheets/admin-change-password.css";
import { changeAdminPassword } from "../../../services/auth";
import { authStorage } from "../../../services";
import { useNavigate } from "react-router-dom";

const AdminChangePassword: React.FC<{ showConfirm: (options: ConfirmModalOptions) => void }> = ({ showConfirm }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        error: false,
        text: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ error: false, text: "" });
        if (newPassword !== confirmPassword) {
            setMessage({ error: true, text: "As senhas não coincidem." });
            return;
        }
        setLoading(true);
        try {
            const adminId = authStorage.getAdminId();
            if (!adminId) throw new Error("Admin não encontrado na sessão.");
            await changeAdminPassword(adminId, currentPassword, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            showConfirm({
                title: "Senha atualizada com sucesso",
                message: `Clique para voltar ao perfil.`,
                confirmText: "Confirmar",
                onConfirm: () => { navigate("/admin/perfil") },
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
                <div className="admin-change-password">
                    <div className="admin-change-password-header">
                        <h1>Alterar Senha</h1>
                    </div>
                    <div className="admin-change-password-content">
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label htmlFor="current-password">Senha Atual</label>
                                <input
                                    id="current-password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="new-password">Nova Senha</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirmar Nova Senha</label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="buttons">
                                <button type="submit" disabled={loading} className="save-btn">
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                                <button type="button" disabled={loading} className="cancel-btn" onClick={() => navigate("/admin/perfil")}>
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

export default withConfirmModal(AdminChangePassword);