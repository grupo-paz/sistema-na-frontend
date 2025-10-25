import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { registerAdmin as registerAdminOriginal } from '../../../../services';

jest.mock('../../../../services', () => {
    return {
        registerAdmin: jest.fn(),
        getAdmins: jest.fn().mockResolvedValue([]),
        removeAdmin: jest.fn()
    };
});

const mockGetAdmins = jest.fn().mockResolvedValue([]);
jest.mocked(require('../../../../services').getAdmins).mockImplementation(mockGetAdmins);
const registerAdmin = registerAdminOriginal as jest.Mock;

jest.mock('../../../../components/header', () => ({
    Header: () => ({
        type: 'div',
        props: { 'data-testid': 'header', children: 'Header' },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
    })
}));

jest.mock('../../../../components', () => {
    const mockModule = {
        ...jest.requireActual('../../../../components'),
        withConfirmModal: jest.fn().mockImplementation((Component) => {
            return function WithMockedConfirm(props: any) {
                return {
                    $$typeof: Symbol.for('react.element'),
                    type: Component,
                    props: { ...props, showConfirm: jest.fn() },
                    ref: null,
                    key: null
                };
            };
        })
    };
    return mockModule;
});

const renderComponent = async () => {
    const AdminAdministratorsPage = require('../admin-adminstrators').default;
    let result;
    await act(async () => {
        result = render(React.createElement(AdminAdministratorsPage));
    });
    await waitFor(() => expect(mockGetAdmins).toHaveBeenCalled());
    return result;
};

describe('AdminAdministrators', () => {
    describe('when rendered', () => {
        beforeEach(async () => {
            jest.clearAllMocks();
            await renderComponent();
        });

        it('should display form and header', async () => {
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByText('Administradores')).toBeInTheDocument();
            expect(screen.getByText('Adicionar Novo Administrador')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should update input values', async () => {
            const nameInput = screen.getByPlaceholderText('Nome');
            const emailInput = screen.getByPlaceholderText('Email');
            
            await act(async () => {
                fireEvent.change(nameInput, { target: { value: 'Maria' } });
                fireEvent.change(emailInput, { target: { value: 'maria@email.com' } });
            });
            
            expect(nameInput).toHaveValue('Maria');
            expect(emailInput).toHaveValue('maria@email.com');
        });
    });

    describe('when submitting the form', () => {
        beforeEach(async () => {
            jest.clearAllMocks();
            await renderComponent();
        });

        it('should call registerAdmin and show message on success', async () => {
            registerAdmin.mockResolvedValue({ message: 'Admin cadastrado!' });
            mockGetAdmins.mockResolvedValue([{ id: 1, name: 'Maria', email: 'maria@email.com' }]);
            
            await act(async () => {
                fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Maria' } });
                fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'maria@email.com' } });
                fireEvent.click(screen.getByText('Adicionar'));
            });
            
            await waitFor(() => {
                expect(registerAdmin).toHaveBeenCalledWith({ name: 'Maria', email: 'maria@email.com' });
                expect(screen.getByText('Admin cadastrado!')).toBeInTheDocument();
            });
        });

        it('should show error message on failure', async () => {
            registerAdmin.mockRejectedValue(new Error('Erro ao cadastrar!'));
            
            await act(async () => {
                fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Maria' } });
                fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'maria@email.com' } });
                fireEvent.click(screen.getByText('Adicionar'));
            });
            
            await waitFor(() => {
                expect(screen.getByText('Erro ao cadastrar!')).toBeInTheDocument();
            });
        });
    });
});
