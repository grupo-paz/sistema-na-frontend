
import React, { useEffect, useState } from "react";
import { Loading, withConfirmModal, ConfirmModalOptions, AdminHeader } from "../../../components";
import { Secretary, UpdateSecretaryBody, getSecretary, updateSecretary, formatDate, formatMoney } from "../../../services";

import "./stylesheets/admin-secretary.css";

const AdminSecretary: React.FC<{ showConfirm: (options: ConfirmModalOptions) => void }> = () => {
    const [loading, setLoading] = useState(false);
    const [updateSecretaryMode, setUpdateSecretaryMode] = useState(false);
    const [message, setMessage] = useState({
        error: false,
        text: ""
    });
    const [secretaryData, setSecretaryData] = useState<Secretary | null>(null);

    useEffect(() => {
        async function fetchSecretary() {
            setLoading(true);
            try {
                const res = await getSecretary();
                setSecretaryData(res);
            } catch {
                setMessage({ error: true, text: "Erro ao carregar dados da secretaria." });
            } finally {
                setLoading(false);
            }
        }

        fetchSecretary();
    }, []);

    const handleUpdateSecretary = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const pixValueInput = formData.get("secretary-pix-value");
        const cashValueInput = formData.get("secretary-cash-value");

        if (!pixValueInput || !cashValueInput) {
            setMessage({ error: true, text: "Por favor, preencha todos os campos." });
            return;
        }

        const pixValue = Number(pixValueInput);
        const cashValue = Number(cashValueInput);

        if (Number.isNaN(pixValue) || Number.isNaN(cashValue) || pixValue < 0 || cashValue < 0) {
            setMessage({ error: true, text: "Por favor, insira valores numéricos válidos e não negativos." });
            return;
        }

        const updatedSecretary: UpdateSecretaryBody = {
            pixValue,
            cashValue,
        };

        try {
            setLoading(true);
            setMessage({ error: false, text: "" });
            const res = await updateSecretary(updatedSecretary);
            setSecretaryData({
                pixValue: res.pixValue,
                cashValue: res.cashValue,
                createdAt: res.createdAt,
                author: res.author,
            });
            setMessage({ error: false, text: "Dados da secretaria atualizados com sucesso." });
            setUpdateSecretaryMode(false);
        } catch (e: any) {
            setMessage({ error: true, text: ("Erro ao atualizar dados da secretaria. " + JSON.parse(e.message).error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <AdminHeader />
            <div className="page-content">
                <div className="admin-secretary-page-header">
                    <h1>Secretaria</h1>
                </div>
                <div className="admin-secretary">
                    <div className="admin-secretary-list-section">
                        <ul className="admin-secretary-list">
                            <li className="admin-secretary-card">
                                <div className="admin-secretary-info">
                                    <span className="admin-secretary-info-title">Pix</span>
                                    <span> {formatMoney(secretaryData?.pixValue || 0)} </span>
                                </div>
                            </li>
                            <li className="admin-secretary-card">
                                <div className="admin-secretary-info">
                                    <span className="admin-secretary-info-title">Dinheiro</span>
                                    <span> {formatMoney(secretaryData?.cashValue || 0)} </span>
                                </div>
                            </li>

                        </ul>
                    </div>

                    {updateSecretaryMode ? (
                        <form className="admin-secretary-form" onSubmit={handleUpdateSecretary}>
                            <div className="form-group">
                                <label htmlFor="secretary-pix-value">Valor Pix</label>
                                <input
                                    id="secretary-pix-value"
                                    name="secretary-pix-value"
                                    type="number"
                                    placeholder="Valor Pix"
                                    defaultValue={secretaryData?.pixValue || 0}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="secretary-cash-value">Valor Dinheiro</label>
                                <input
                                    id="secretary-cash-value"
                                    name="secretary-cash-value"
                                    type="number"
                                    placeholder="Valor Dinheiro"
                                    defaultValue={secretaryData?.cashValue || 0}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="buttons">
                                <button className="save-btn" disabled={loading} type="submit">
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                                <button
                                    className="cancel-btn"
                                    disabled={loading}
                                    type="button"
                                    onClick={() => {
                                        setUpdateSecretaryMode(false);
                                        setMessage({ error: false, text: "" });
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            className="save-btn"
                            disabled={loading}
                            onClick={() => {
                                setUpdateSecretaryMode(true);
                                setMessage({ error: false, text: "" }); // Limpa mensagens ao entrar no modo edição
                            }}
                        >
                            Atualizar Valores
                        </button>
                    )}

                    {message.text && (
                        <div className={`form-message ${message.error ? 'form-message-error' : 'form-message-success'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="admin-secretary-metadata">
                        <h3>Última atualização</h3>
                        <div className="admin-secretary-metadata-info">
                            <p>{secretaryData?.createdAt ? formatDate(secretaryData.createdAt) : "Não disponível"}</p>
                            <p>{secretaryData?.author?.name || "Usuário não identificado"}</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default withConfirmModal(AdminSecretary);