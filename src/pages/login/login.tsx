import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, authStorage } from "../../services"
import { Header } from "../../components/header/header"

import "./stylesheets/login.css"

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (authStorage.getAccessToken()) {
            navigate("/admin")
        }
    }, [navigate])

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await login(email, password)
            navigate("/admin")
        } catch (err: any) {
            setError(JSON.parse(err.message)?.error || "Falha no login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <div className="page-content login-container">
                <h2>Adm Grupo Paz</h2>
                <form onSubmit={onSubmit} className="login-form">
                    <input
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        placeholder="Login"
                        aria-label="Email"
                        required />
                    <input
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        placeholder="Senha"
                        aria-label="Senha"
                        required />
                    <button type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                    <button type="button" disabled={loading} className="forgot-password-btn" onClick={() => navigate("/forgot-password")}>
                        Esqueci minha senha
                    </button>
                    {error && <p className="login-error">{error}</p>}
                </form>
            </div>
        </>
    )
}
