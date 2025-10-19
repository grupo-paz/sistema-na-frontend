import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockChangeAdminPassword = jest.fn();
const mockAuthStorage = {
    getAdminId: jest.fn().mockReturnValue('123')
};

const mockShowConfirm = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../../../services/auth', () => ({
    changeAdminPassword: jest.fn().mockImplementation((...args) => mockChangeAdminPassword(...args))
}));

jest.mock('../../../../services', () => ({
    authStorage: mockAuthStorage
}));

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}));

jest.mock('../../../../components', () => {
    const mockWithConfirmModal = jest.fn().mockImplementation((Component) => {
        const WrappedComponent = (props: any) => {
            const ComponentWithConfirm = require('react').createElement(Component, {
                ...props,
                showConfirm: (options: { onConfirm: () => void; }) => {
                    mockShowConfirm(options);
                    options?.onConfirm();
                }
            });
            return ComponentWithConfirm;
        };
        return WrappedComponent;
    });

    return {
        Header: () => ({
            type: 'div',
            props: { 'data-testid': 'header', children: 'Header' },
            key: null,
            ref: null,
            $$typeof: Symbol.for('react.element')
        }),
        withConfirmModal: mockWithConfirmModal,
        ConfirmModalOptions: {}
    };
});

describe('ChangePasswordPage', () => {
    const renderComponent = () => {
        const ChangePasswordPage = require('../change-password').default;
        return render(React.createElement(ChangePasswordPage));
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockChangeAdminPassword.mockResolvedValue({ message: 'Senha alterada com sucesso!' });
    });

    it('should render header and password form', () => {
        renderComponent();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Alterar Senha')).toBeInTheDocument();
        expect(screen.getByLabelText('Senha Atual')).toBeInTheDocument();
        expect(screen.getByLabelText('Nova Senha')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirmar Nova Senha')).toBeInTheDocument();
    });

    it('should validate passwords match', async () => {
        renderComponent();
        
        fireEvent.change(screen.getByLabelText('Senha Atual'), { target: { value: 'senha123' } });
        fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'novaSenha123' } });
        fireEvent.change(screen.getByLabelText('Confirmar Nova Senha'), { target: { value: 'diferente123' } });
        
        fireEvent.click(screen.getByText('Salvar'));
        
        expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument();
        
        expect(mockChangeAdminPassword).not.toHaveBeenCalled();
    });

    it('should submit when passwords match', async () => {
        renderComponent();
        
        fireEvent.change(screen.getByLabelText('Senha Atual'), { target: { value: 'senha123' } });
        fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'novaSenha123' } });
        fireEvent.change(screen.getByLabelText('Confirmar Nova Senha'), { target: { value: 'novaSenha123' } });
        
        fireEvent.click(screen.getByText('Salvar'));
        
        await waitFor(() => {
            expect(mockAuthStorage.getAdminId).toHaveBeenCalled();
            expect(mockChangeAdminPassword).toHaveBeenCalledWith('123', 'senha123', 'novaSenha123');
        });
        
        expect(mockShowConfirm).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Senha atualizada com sucesso',
            message: 'Clique para voltar ao perfil.',
        }));
    });

    it('should navigate back when cancel button is clicked', () => {
        renderComponent();
        
        fireEvent.click(screen.getByText('Cancelar'));
        
        expect(mockNavigate).toHaveBeenCalledWith('/admin/perfil');
    });
    
    it('should handle error when password change fails', async () => {
        mockChangeAdminPassword.mockRejectedValue(new Error('Senha atual incorreta'));
        
        renderComponent();
        
        fireEvent.change(screen.getByLabelText('Senha Atual'), { target: { value: 'senha123' } });
        fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'novaSenha123' } });
        fireEvent.change(screen.getByLabelText('Confirmar Nova Senha'), { target: { value: 'novaSenha123' } });
        
        fireEvent.click(screen.getByText('Salvar'));
        
        await waitFor(() => {
            expect(screen.getByText(/Erro ao alterar senha/)).toBeInTheDocument();
        });
    });
});