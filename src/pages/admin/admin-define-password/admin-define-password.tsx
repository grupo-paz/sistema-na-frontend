import { FormEvent, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { definePassword, authStorage } from "../../../services";
import { Header, Loading } from "../../../components";

import "./stylesheets/admin-define-password.css";

export function AdminDefinePassword() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const token = search.get("token") || "";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    error: false,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!token) {
      setMessage({ text: "Token não encontrado na URL.", error: true });
      return;
    }

    setLoading(true);
    setMessage({ text: '', error: false });
    try {
      const res = await definePassword(token, password);
      setMessage({
        text: res.message + " Redirecionando para a tela de login em 3 segundos...",
        error: false,
      });
      authStorage.clear();

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (e: any) {
      setMessage({ error: true, text: "Erro ao alterar senha. " + JSON.parse(e.message).issues[0]?.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <Header />
      <div className="page-content">
        <div className="admin-define-password">
          <div className="admin-define-password-header">
            <h1>Definir senha</h1>
          </div>
          <div className="admin-define-password-content">
            <p className="admin-define-password-text">Insira sua nova senha</p>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <input
                  id="new-password"
                  type="password"
                  placeholder="Nova Senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
