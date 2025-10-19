import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock dos serviços
const mockUpdateAdmin = jest.fn();
const mockGetAdminById = jest.fn();
const mockAuthStorage = {
    getAdminId: jest.fn(),
    getAdmin: jest.fn()
};

jest.mock('../../../../services/admin', () => ({
    updateAdmin: (...args: any[]) => mockUpdateAdmin(...args),
    getAdminById: (...args: any[]) => mockGetAdminById(...args)
}));

jest.mock('../../../../services', () => ({
    authStorage: mockAuthStorage
}));

// Mock dos componentes
jest.mock('../../../../components', () => ({
    Header: () => ({
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

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('AdminProfile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAuthStorage.getAdminId.mockReturnValue('123');
        mockGetAdminById.mockResolvedValue({
            id: '123',
            name: 'Admin Teste',
            email: 'admin@teste.com'
        });
    });

    const renderComponent = () => {
        const { AdminProfile } = require('../admin-profile');
        return render(React.createElement(AdminProfile));
    };

    it('should render header and profile info', async () => {
        renderComponent();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        
        // Espera os dados serem carregados
        await waitFor(() => {
            expect(screen.getByText('Perfil')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Admin Teste')).toBeInTheDocument();
            expect(screen.getByDisplayValue('admin@teste.com')).toBeInTheDocument();
        });
    });

    it('should fetch admin data on load', async () => {
        renderComponent();
        await waitFor(() => {
            expect(mockAuthStorage.getAdminId).toHaveBeenCalled();
            expect(mockGetAdminById).toHaveBeenCalledWith('123');
        });
    });

    it('should toggle edit mode when Edit button is clicked', async () => {
        renderComponent();
        
        // Espera os dados serem carregados
        await waitFor(() => {
            expect(screen.getByDisplayValue('Admin Teste')).toBeInTheDocument();
        });

        // Verificando que os campos são readOnly inicialmente
        const nameInput = screen.getByLabelText('Nome');
        expect(nameInput).toHaveAttribute('readOnly');

        // Clica no botão de editar
        fireEvent.click(screen.getByText('Editar Informações'));

        // Verifica que os campos não são mais readOnly
        expect(nameInput).not.toHaveAttribute('readOnly');

        // Verifica que o botão de salvar apareceu
        expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    it('should update admin data when form is submitted', async () => {
        renderComponent();
        
        // Espera os dados serem carregados
        await waitFor(() => {
            expect(screen.getByDisplayValue('Admin Teste')).toBeInTheDocument();
        });

        // Entra no modo de edição
        fireEvent.click(screen.getByText('Editar Informações'));

        // Altera o nome
        const nameInput = screen.getByLabelText('Nome');
        fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });

        // Submete o formulário
        fireEvent.click(screen.getByText('Salvar'));

        // Verifica que updateAdmin foi chamado com os dados corretos
        await waitFor(() => {
            expect(mockUpdateAdmin).toHaveBeenCalledWith('123', {
                name: 'Novo Nome',
                email: 'admin@teste.com'
            });
            expect(screen.getByText('Perfil atualizado com sucesso!')).toBeInTheDocument();
        });
    });

    it('should navigate to change password page when button is clicked', async () => {
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByText('Alterar Senha')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Alterar Senha'));
        expect(mockNavigate).toHaveBeenCalledWith('/admin/perfil/alterar-senha');
    });

    it('should reset form when cancel button is clicked in edit mode', async () => {
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByDisplayValue('Admin Teste')).toBeInTheDocument();
        });

        // Entra no modo de edição
        fireEvent.click(screen.getByText('Editar Informações'));

        // Altera o nome
        const nameInput = screen.getByLabelText('Nome');
        fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });
        expect(nameInput).toHaveValue('Novo Nome');

        // Clica em cancelar
        fireEvent.click(screen.getByText('Cancelar'));

        // Verifica que o nome voltou ao original
        await waitFor(() => {
            expect(screen.getByLabelText('Nome')).toHaveValue('Admin Teste');
            expect(nameInput).toHaveAttribute('readOnly');
        });
    });
});