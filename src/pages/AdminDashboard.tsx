import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { listAdmins, registerAdmin, authStorage } from "../services/api"

import "../stylesheets/AdminDashboard.css"

interface Admin { id?: string; name: string; email: string; }

export function AdminDashboard() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    async function load() {
        try {
            const data = await listAdmins()
            setAdmins(data)
        } catch (e: any) {
            console.error(e)
        }
    }
    useEffect(() => { load() }, [])

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        try {
            const res = await registerAdmin({ name, email })
            setMessage(res.message)
            setName("")
            setEmail("")
            load()
        } catch (e: any) {
            setMessage(e.message || "Erro")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-wrapper">
            <div className="admin-header">
                <h2>Área Administrativa</h2>
                <div className="admin-header-actions">
                    <button onClick={() => navigate("/alterar-senha")}>
                        Alterar Senha
                    </button>
                    <button onClick={() => { authStorage.clear(); navigate("/login") }}>
                        Sair
                    </button>
                </div>
            </div>
            <section>
                <h3>Novo Admin</h3>
                <form onSubmit={onSubmit} className="admin-new-form">
                    <label className="admin-form-label">Nome
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required />
                    </label>
                    <label className="admin-form-label">Email
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            required />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Salvando..." : "Criar"}
                    </button>
                </form>
                {message && <p>{message}</p>}
            </section>
            <section className="admin-admins">
                <h3>Admins</h3>
                <ul>
                    {admins.map(a => <li key={a.id || a.email}>{a.name} - {a.email}</li>)}
                </ul>
            </section>
        </div>
    )
}
