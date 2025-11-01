import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock dos serviços
const mockForgotAdminPassword = jest.fn();
const mockShowConfirm = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../../services/auth', () => ({
    forgotAdminPassword: jest.fn().mockImplementation((...args) => mockForgotAdminPassword(...args))
}));

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}));

// Mock do componente Header e withConfirmModal
jest.mock('../../../components', () => {
    const mockWithConfirmModal = jest.fn().mockImplementation((Component) => {
        const WrappedComponent = (props: any) => {
            const ComponentWithConfirm = require('react').createElement(Component, {
                ...props,
                showConfirm: (options: any) => {
                    mockShowConfirm(options);
                    if (options?.onConfirm) options.onConfirm();
                }
            });
            return ComponentWithConfirm;
        };
        return WrappedComponent;
    });

    return {
        AdminHeader: () => ({
            type: 'div',
            props: { 'data-testid': 'header', children: 'Header' },
            key: null,
            ref: null,
            $$typeof: Symbol.for('react.element')
        }),
        Loading: () => ({
            type: 'div',
            props: { 'data-testid': 'loading', children: 'Carregando...' },
            key: null,
            ref: null,
            $$typeof: Symbol.for('react.element')
        }),
        withConfirmModal: mockWithConfirmModal,
        ConfirmModalOptions: {}
    };
});

describe('ForgotPassword', () => {
    const renderComponent = () => {
        const ForgotPasswordPage = require('../forgot-password').default;
        return render(React.createElement(ForgotPasswordPage));
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockForgotAdminPassword.mockResolvedValue({ message: 'Email de recuperação enviado com sucesso!' });
    });

    it('should render header and forgot password form', () => {
        renderComponent();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Recuperar a senha')).toBeInTheDocument();
        expect(screen.getByText('Insira seu email para receber instruções de recuperação de senha.')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByText('Enviar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('should handle empty email validation correctly', async () => {
        renderComponent();
        
        // Simula chamar o handleSubmit diretamente com email vazio
        const emailInput = screen.getByPlaceholderText('Email');
        
        // Remove o atributo required temporariamente para o teste
        emailInput.removeAttribute('required');
        
        // Tenta enviar sem email
        fireEvent.click(screen.getByText('Enviar'));
        
        // Verifica que a mensagem de erro aparece
        await waitFor(() => {
            expect(screen.getByText('Email é obrigatório.')).toBeInTheDocument();
        });
        
        // Verifica que a API não foi chamada
        expect(mockForgotAdminPassword).not.toHaveBeenCalled();
    });

    it('should submit when email is provided', async () => {
        renderComponent();
        
        // Preenche o email
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@teste.com' } });
        
        // Envia o formulário
        fireEvent.click(screen.getByText('Enviar'));
        
        // Verifica que a API foi chamada corretamente
        await waitFor(() => {
            expect(mockForgotAdminPassword).toHaveBeenCalledWith('admin@teste.com');
        });
        
        // Verifica que o modal de confirmação é mostrado
        expect(mockShowConfirm).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Recuperação de senha enviada com sucesso',
            message: expect.stringContaining('Email de recuperação enviado com sucesso!')
        }));
    });

    it('should navigate back when cancel button is clicked', () => {
        renderComponent();
        
        // Clica no botão cancelar
        fireEvent.click(screen.getByText('Cancelar'));
        
        // Verifica que navegou de volta para a página de login
        expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    });
    
    it('should handle error when forgot password fails', async () => {
        const errorMessage = JSON.stringify({
            issues: [{ message: 'Email não encontrado' }]
        });
        mockForgotAdminPassword.mockRejectedValue(new Error(errorMessage));
        
        renderComponent();
        
        // Preenche o email
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@teste.com' } });
        
        // Envia o formulário
        fireEvent.click(screen.getByText('Enviar'));
        
        // Verifica que a mensagem de erro aparece
        await waitFor(() => {
            expect(screen.getByText('Erro ao alterar senha. Email não encontrado')).toBeInTheDocument();
        });
    });

    it('should show loading component when submitting', async () => {
        // Mock para simular demora na resposta
        mockForgotAdminPassword.mockImplementation(() => new Promise(resolve => {
            setTimeout(() => resolve({ message: 'Sucesso' }), 100);
        }));
        
        renderComponent();
        
        // Preenche o email
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@teste.com' } });
        
        // Envia o formulário
        fireEvent.click(screen.getByText('Enviar'));
        
        // Verifica se o loading aparece
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.getByText('Enviando...')).toBeInTheDocument();
        
        // Aguarda finalizar
        await waitFor(() => {
            expect(mockShowConfirm).toHaveBeenCalled();
        });
    });

    it('should clear error message when form is submitted successfully', async () => {
        renderComponent();
        
        const emailInput = screen.getByPlaceholderText('Email');
        emailInput.removeAttribute('required');
        
        // Primeiro, cria um erro
        fireEvent.click(screen.getByText('Enviar'));
        await waitFor(() => {
            expect(screen.getByText('Email é obrigatório.')).toBeInTheDocument();
        });
        
        // Depois preenche o email e envia
        fireEvent.change(emailInput, { target: { value: 'admin@teste.com' } });
        fireEvent.click(screen.getByText('Enviar'));
        
        // Verifica que o erro foi limpo
        await waitFor(() => {
            expect(screen.queryByText('Email é obrigatório.')).not.toBeInTheDocument();
        });
    });
});