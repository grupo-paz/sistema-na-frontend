import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, authStorage } from "../services/api"

import "../stylesheets/LoginPage.css"

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
            setError(err.message || "Falha no login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <h2>Login Admin</h2>
            <form onSubmit={onSubmit} className="login-form">
                <label>
                    Email
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        required />
                </label>
                <label>
                    Senha
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        required />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
                {error && <p className="login-error">{error}</p>}
            </form>
        </div>
    )
}
