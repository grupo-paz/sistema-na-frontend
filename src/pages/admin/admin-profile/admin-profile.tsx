
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminHeader, Loading } from "../../../components";
import { Admin, authStorage } from "../../../services";
import { getAdminById, updateAdmin } from "../../../services/admin";
import "./stylesheets/admin-profile.css";

export function AdminProfile() {
    const [id, setId] = useState<string>("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState({
        error: false,
        text: ""
    });
    const navigate = useNavigate();

    const fetchProfile = async () => {
        setLoading(true);
        const adminId = authStorage.getAdminId();
        if (!adminId) {
            setMessage({ error: true, text: "ID do administrador não encontrado." });
            setLoading(false);
            return;
        }
        try {
            const admin = await getAdminById(adminId);
            setAdmin(admin);
            setId(admin.id);
            setName(admin.name);
            setEmail(admin.email);
        } catch {
            setMessage({ error: true, text: "Erro ao carregar perfil." });
        } finally {
            setLoading(false);
        }
    };

    const resetAdmin = () => {
        if (admin) {
            setName(admin.name);
            setEmail(admin.email);
            setEditMode(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ error: false, text: "" });
        try {
            await updateAdmin(id, { name, email });
            setEditMode(false);
            setMessage({ error: false, text: "Perfil atualizado com sucesso!" });
        } catch {
            setMessage({ error: true, text: "Erro ao atualizar perfil." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <AdminHeader />
            <div className="page-content">
                <div className="admin-profile-header">
                    <h1>Perfil</h1>
                </div>
                <div className="admin-form-section">
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label htmlFor="admin-name">Nome</label>
                            <input
                                id="admin-name"
                                type="text"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                readOnly={!editMode}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="admin-email">Email</label>
                            <input
                                id="admin-email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                readOnly={!editMode}
                            />
                        </div>
                        <div className="buttons">
                            {editMode ?
                                <>
                                    <button type="submit" disabled={loading} className="save-btn">
                                        {loading ? "Salvando..." : "Salvar"}
                                    </button>
                                    <button type="button" onClick={() => resetAdmin()} className="cancel-btn">
                                        Cancelar
                                    </button>
                                </>
                                :
                                <>
                                    <button type="button" className="change-password-btn" onClick={() => navigate("/admin/perfil/alterar-senha")}>
                                        Alterar Senha
                                    </button>
                                    <button type="button" onClick={() => setEditMode(!editMode)} className="edit-btn">
                                        Editar Informações
                                    </button>
                                </>
                            }
                        </div>
                    {message?.text && <p className={message.error ? "form-message-error" : "form-message-success"}>{message.text}</p>}
                    </form>
                </div>
            </div>
        </>
    );
}