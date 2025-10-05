import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin, authStorage } from "../services/api";

import "../stylesheets/AdminDashboard.css";

export function AdminDashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <div className="admin-wrapper">
      <div className="admin-header">
        <h2>Área Administrativa</h2>
        <div className="admin-header-actions">
          <button
            onClick={() => {
              authStorage.clear();
              navigate("/login");
            }}
          >
            Sair
          </button>
        </div>
      </div>
      <section>
        <h3>Novo Admin</h3>
        <form onSubmit={onSubmit} className="admin-new-form">
          <label className="admin-form-label">
            Nome
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="admin-form-label">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Criar"}
          </button>
        </form>
        {message && <p>{message}</p>}
      </section>
    </div>
  );
}
