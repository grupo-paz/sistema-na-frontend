import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { registerAdmin } from '../../../../services/api';

jest.mock('../../../../services/api', () => ({
    registerAdmin: jest.fn(),
}));

jest.mock('../../../../widgets/header/header', () => ({
    Header: () => ({
        type: 'div',
        props: { 'data-testid': 'header', children: 'Header' },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
    }),
}));

const renderComponent = () => {
    const { AdminAdministrators } = require('../admin-adminstrators');
    return render(React.createElement(AdminAdministrators));
};

describe('AdminAdministrators', () => {
    describe('when rendered', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            renderComponent();
        });

        it('should display form and header', () => {
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByText('Administradores')).toBeInTheDocument();
            expect(screen.getByText('Adicionar Novo Administrador')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should update input values', () => {
            const nameInput = screen.getByPlaceholderText('Nome');
            const emailInput = screen.getByPlaceholderText('Email');
            fireEvent.change(nameInput, { target: { value: 'Maria' } });
            fireEvent.change(emailInput, { target: { value: 'maria@email.com' } });
            expect(nameInput.value).toBe('Maria');
            expect(emailInput.value).toBe('maria@email.com');
        });
    });

    describe('when submitting the form', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            renderComponent();
        });

        it('should call registerAdmin and show message on success', async () => {
            registerAdmin.mockResolvedValue({ message: 'Admin cadastrado!' });
            fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Maria' } });
            fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'maria@email.com' } });
            fireEvent.click(screen.getByRole('button'));
            await waitFor(() => {
                expect(registerAdmin).toHaveBeenCalledWith({ name: 'Maria', email: 'maria@email.com' });
                expect(screen.getByText('Admin cadastrado!')).toBeInTheDocument();
            });
        });

        it('should show error message on failure', async () => {
            registerAdmin.mockRejectedValue(new Error('Erro ao cadastrar!'));
            fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Maria' } });
            fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'maria@email.com' } });
            fireEvent.click(screen.getByRole('button'));
            await waitFor(() => {
                expect(screen.getByText('Erro ao cadastrar!')).toBeInTheDocument();
            });
        });
    });
});
