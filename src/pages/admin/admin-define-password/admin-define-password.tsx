import { FormEvent, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { definePassword, authStorage } from "../../../services/api";

import "./stylesheets/admin-define-password.css";

export function AdminDefinePassword() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const token = search.get("token") || "";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!token) {
      setError("Token não encontrado na URL.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await definePassword(token, password);
      setMessage(
        res.message + " Redirecionando para a tela de login em 3 segundos..."
      );
      authStorage.clear();

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (e: any) {
      setError(e.message || "Erro ao definir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="define-password-wrapper">
      <h2>Definir Nova Senha</h2>
      <form onSubmit={onSubmit} className="define-password-form">
        <label>
          Nova Senha
          <input
            value={password}
            type="password"
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading || !token}>
          {loading ? "Salvando..." : "Definir Senha"}
        </button>
      </form>
      {message && <p className="define-password-success">{message}</p>}
      {error && <p className="define-password-error">{error}</p>}
      {!token && (
        <p className="define-password-error">
          Token de ativação não encontrado. Por favor, use o link enviado para o
          seu e-mail.
        </p>
      )}
    </div>
  );
}
