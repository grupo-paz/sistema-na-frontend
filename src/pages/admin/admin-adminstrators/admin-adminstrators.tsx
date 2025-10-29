
import React, { FormEvent, useEffect, useState } from "react";
import { Admin, getAdmins, registerAdmin, removeAdmin } from "../../../services";
import { Loading, withConfirmModal, ConfirmModalOptions, AdminHeader } from "../../../components";

import "./stylesheets/admin-adminstrators.css";

const AdminAdministrators: React.FC<{ showConfirm: (options: ConfirmModalOptions) => void }> = ({ showConfirm }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        error: false,
        text: ""
    });
    const [admins, setAdmins] = useState<Admin[]>([]);

    useEffect(() => {
        async function fetchAdmins() {
            setLoading(true);
            try {
                const res = await getAdmins();
                setAdmins(res);
            } catch (e) {
                console.error("Erro ao buscar administradores:", e);
                setMessage({ error: true, text: "Erro ao carregar administradores." });
            }
            finally {
                setLoading(false);
            }
        }
        fetchAdmins();
    }, []);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage({ error: false, text: "" });
        try {
            const res = await registerAdmin({ name, email });
            setMessage({ error: false, text: res.message });
            setName("");
            setEmail("");

            const updated = await getAdmins();
            setAdmins(updated);
        } catch (e: any) {
            setMessage({ error: true, text: e.message || "Erro" });
        } finally {
            setLoading(false);
        }
    }

    function handleRemove(admin: Admin) {
        showConfirm({
            title: "Remover administrador",
            message: `Tem certeza que deseja remover ${admin.name}?`,
            confirmText: "Remover",
            cancelText: "Cancelar",
            onConfirm: () => {
                setLoading(true);

                removeAdmin(admin.id)
                    .then(() => {
                        setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
                    })
                    .catch((e: any) => {
                        alert(`Erro ao remover administrador: ${e?.message || e}`);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            },
        });
    }

    return (
        <>
            {loading && <Loading />}
            <AdminHeader />
            <div className="page-content">
                <div className="admin-page-header">
                    <h1>Administradores</h1>
                </div>
                <div className="admin-list-section">
                    <ul className="admin-list">

                        {admins.length === 0 && !loading && <li>Nenhum administrador cadastrado.</li>}
                        {admins.map((admin) => (
                            <li key={admin.id || admin.email} className="admin-card">
                                <div className="admin-info">
                                    <span className="admin-name">{admin.name}</span>
                                    <span className="admin-email">{admin.email}</span>
                                </div>
                                <div className="admin-actions">
                                    <button className="admin-action-btn" title="Remover" onClick={() => handleRemove(admin)}>
                                        <svg viewBox="0 0 24 24">
                                            <rect x="4" y="4" width="16" height="2" rx="1" fill="white"></rect>
                                            <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm3.46-8.12a1 1 0 0 1 1.41 0L12 11.59l1.12-1.12a1 1 0 1 1 1.41 1.41L13.41 13l1.12 1.12a1 1 0 0 1-1.41 1.41L12 14.41l-1.12 1.12a1 1 0 0 1-1.41-1.41L10.59 13l-1.12-1.12a1 1 0 0 1 0-1.41z" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="admin-form-section">
                    <h3>Adicionar Novo Administrador</h3>
                    <form onSubmit={onSubmit} className="admin-form">
                        <div className="form-group">
                            <input
                                id="admin-name"
                                type="text"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                id="admin-email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? "Adicionando..." : "Adicionar"}
                        </button>
                    </form>
                    {message?.text && <p className={message.error ? "form-message-error" : "form-message-success"}>{message.text}</p>}
                </div>
            </div>
        </>
    );
}

export default withConfirmModal(AdminAdministrators);