import { useState } from "react";
import { ConfirmModalOptions, Header, withConfirmModal } from "../../../components";
import "./stylesheets/admin-profile.css";
import { changeAdminPassword } from "../../../services/auth";
import { authStorage } from "../../../services";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage: React.FC<{ showConfirm: (options: ConfirmModalOptions) => void }> = ({ showConfirm }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (newPassword !== confirmPassword) {
            setMessage("As senhas não coincidem.");
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
        } catch (error) {
            setMessage("Erro ao alterar senha." + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="admin-profile">
                <div className="admin-profile-header">
                    <h1>Alterar Senha</h1>
                </div>
                <div className="admin-profile-content">
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
                        {message && <div className="form-message">{message}</div>}
                    </form>
                </div>
            </div>
        </>
    );
}

export default withConfirmModal(ChangePasswordPage);