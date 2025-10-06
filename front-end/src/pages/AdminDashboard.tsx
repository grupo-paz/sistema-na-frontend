import { FormEvent, useState } from "react";
import { registerAdmin } from "../services/api";
import { Header } from "../components/Header";

import "../stylesheets/AdminDashboard.css";

export function AdminDashboard() {
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
      <div className="admin-wrapper">
        <div className="admin-header">
          <h2>Área Administrativa</h2>
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
    </>
  );
}
