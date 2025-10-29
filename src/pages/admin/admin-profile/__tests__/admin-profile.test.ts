import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

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

jest.mock('../../../../components', () => ({
    AdminHeader: () => ({
        type: 'div',
        props: { 'data-testid': 'admin-header', children: 'AdminHeader' },
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
        expect(screen.getByTestId('admin-header')).toBeInTheDocument();
        
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
        
        await waitFor(() => {
            expect(screen.getByDisplayValue('Admin Teste')).toBeInTheDocument();
        });

        const nameInput = screen.getByLabelText('Nome');
        expect(nameInput).toHaveAttribute('readOnly');

        fireEvent.click(screen.getByText('Editar Informações'));

        expect(nameInput).not.toHaveAttribute('readOnly');

        expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    it('should update admin data when form is submitted', async () => {
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByDisplayValue('Admin Teste')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Editar Informações'));

        const nameInput = screen.getByLabelText('Nome');
        fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });

        fireEvent.click(screen.getByText('Salvar'));

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

        fireEvent.click(screen.getByText('Editar Informações'));

        const nameInput = screen.getByLabelText('Nome');
        fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });
        expect(nameInput).toHaveValue('Novo Nome');

        fireEvent.click(screen.getByText('Cancelar'));

        await waitFor(() => {
            expect(screen.getByLabelText('Nome')).toHaveValue('Admin Teste');
            expect(nameInput).toHaveAttribute('readOnly');
        });
    });
});