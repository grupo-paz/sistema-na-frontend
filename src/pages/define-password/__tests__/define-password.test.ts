import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockDefinePassword = jest.fn();
const mockAuthStorage = {
    clear: jest.fn()
};
const mockNavigate = jest.fn();
const mockSearchParams = { get: jest.fn() };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams],
}));

jest.mock('../../../services', () => ({
    definePassword: jest.fn().mockImplementation((...args) => mockDefinePassword(...args)),
    authStorage: mockAuthStorage,
}));

// Mock dos componentes
jest.mock('../../../components', () => ({
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
    })
}));

describe('DefinePassword', () => {
    const renderComponent = () => {
        const { DefinePassword } = require('../define-password');
        return render(React.createElement(DefinePassword));
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockReset();
        mockSearchParams.get.mockReset();
        mockSearchParams.get.mockReturnValue('token123');
        mockDefinePassword.mockResolvedValue({ message: 'Senha definida!' });
    });

    it('should render header and define password form', () => {
        renderComponent();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Definir senha')).toBeInTheDocument();
        expect(screen.getByText('Insira sua nova senha')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nova Senha')).toBeInTheDocument();
        expect(screen.getByText('Enviar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('should show error if token is missing', async () => {
        // Configura mock para retornar string vazia (sem token)
        mockSearchParams.get.mockReturnValue('');
        
        renderComponent();
        
        const passwordInput = screen.getByPlaceholderText('Nova Senha');
        passwordInput.removeAttribute('required');
        
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Enviar'));
        
        await waitFor(() => {
            expect(screen.getByText('Token não encontrado na URL.')).toBeInTheDocument();
        });
        
        expect(mockDefinePassword).not.toHaveBeenCalled();
    });

    it('should call definePassword and show message on success', async () => {
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText('Nova Senha'), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Enviar'));
        await waitFor(() => {
            expect(mockDefinePassword).toHaveBeenCalledWith('token123', '123456');
            expect(screen.getByText(/Senha definida!/)).toBeInTheDocument();
        });
    });

    it('should show error on API failure', async () => {
        const errorMessage = JSON.stringify({
            issues: [{ message: 'Token inválido ou expirado' }]
        });
        mockDefinePassword.mockRejectedValue(new Error(errorMessage));
        
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText('Nova Senha'), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Enviar'));
        await waitFor(() => {
            expect(screen.getByText('Erro ao alterar senha. Token inválido ou expirado')).toBeInTheDocument();
        });
    });

    it('should navigate back when cancel button is clicked', () => {
        renderComponent();
        
        fireEvent.click(screen.getByText('Cancelar'));
        
        expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    });

    it('should show loading component when submitting', async () => {
        mockDefinePassword.mockImplementation(() => new Promise(resolve => {
            setTimeout(() => resolve({ message: 'Sucesso' }), 100);
        }));
        
        renderComponent();
        
        fireEvent.change(screen.getByPlaceholderText('Nova Senha'), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Enviar'));
        
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.getByText('Enviando...')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText(/Sucesso/)).toBeInTheDocument();
        });
    });

    it('should clear auth storage and redirect after success', async () => {
        jest.useFakeTimers();
        
        renderComponent();
        
        fireEvent.change(screen.getByPlaceholderText('Nova Senha'), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Enviar'));
        
        await waitFor(() => {
            expect(mockAuthStorage.clear).toHaveBeenCalled();
            expect(screen.getByText(/Senha definida!/)).toBeInTheDocument();
        });
        
        // Avança 3 segundos
        jest.advanceTimersByTime(3000);
        
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
        
        jest.useRealTimers();
    });
});
