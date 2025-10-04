import { FormEvent, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { changePassword, authStorage, login } from "../services/api"

import "../stylesheets/ChangePassword.css"

export function ChangePasswordPage() {
    const [search] = useSearchParams()
    const navigate = useNavigate()

    const email = search.get("email") || authStorage.getEmail() || ""

    const prefilledOld = search.get("oldPassword") || ""
    const [oldPassword, setOldPassword] = useState(prefilledOld)

    const [newPassword, setNewPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        setError(null)
        try {
            const res = await changePassword(email, oldPassword, newPassword)
            setMessage(res.message + "\nLevando para a tela inicial")

            if (!authStorage.getAccessToken()) {
                try {
                    await login(email, newPassword)
                } catch (e) { 
                    console.error(e)
                }
            }

            setTimeout(() => {
                navigate("/admin")
            }, 1000)

        } catch (e: any) {
            setError(e.message || "Erro")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="change-wrapper">
            <h2>Alterar Senha</h2>
            <form onSubmit={onSubmit} className="change-form">
                {!(email && prefilledOld) && (
                    <label>Senha Atual
                        <input
                            type="password"
                            required
                            onChange={e => setOldPassword(e.target.value)} />
                    </label>
                )
                }
                <label>Nova Senha
                    <input
                        value={newPassword}
                        type="password"
                        required
                        onChange={e => setNewPassword(e.target.value)} />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Alterar Senha"}
                </button>
            </form>
            {message && <p className="change-success">{message}</p>}
            {error && <p className="change-error">{error}</p>}
        </div>
    )
}
