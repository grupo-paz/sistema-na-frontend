import { FormEvent, useState } from "react";
import { registerAdmin } from "../../../services/api";
import { Header } from "../../../widgets";

import "./stylesheets/admin-adminstrators.css";

export function AdminAdministrators() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const res = await registerAdmin({ name, email });
            setMessage(res.message);
            setName("");
            setEmail("");
        } catch (e: any) {
            setMessage(e.message || "Erro");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />
            <div className="admin-page-content">
                <div className="admin-page-header">
                    <h1>Administradores</h1>
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
                    {message && <p className="form-message">{message}</p>}
                </div>
            </div>
        </>
    );
}