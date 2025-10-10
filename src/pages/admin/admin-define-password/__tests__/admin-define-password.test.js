import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { definePassword } from '../../../../services/api';

const mockNavigate = jest.fn();
const mockSearchParams = { get: jest.fn() };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams],
}));

jest.mock('../../../../services/api', () => ({
    definePassword: jest.fn(),
    authStorage: {
        clear: jest.fn(),
    },
}));

describe('AdminDefinePassword', () => {
    const renderComponent = () => {
        const { AdminDefinePassword } = require('../admin-define-password');
        return render(React.createElement(AdminDefinePassword));
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockReset();
        mockSearchParams.get.mockReset();
        mockSearchParams.get.mockReturnValue('token123');
    });

    it('should render form and handle input', () => {
        renderComponent();
        expect(screen.getByText('Definir Nova Senha')).toBeInTheDocument();
        expect(screen.getByLabelText('Nova Senha')).toBeInTheDocument();
    });

    it('should show error if token is missing', () => {
        mockSearchParams.get.mockReturnValueOnce(null);
        renderComponent();
        expect(screen.getByText('Token de ativação não encontrado. Por favor, use o link enviado para o seu e-mail.')).toBeInTheDocument();
    });

    it('should call definePassword and show message on success', async () => {
        definePassword.mockResolvedValue({ message: 'Senha definida!' });
        renderComponent();
        fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(definePassword).toHaveBeenCalledWith('token123', '123456');
            expect(screen.getByText(/Senha definida!/)).toBeInTheDocument();
        });
    });

    it('should show error on API failure', async () => {
        definePassword.mockRejectedValue(new Error('Erro ao definir a senha.'));
        renderComponent();
        fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(screen.getByText('Erro ao definir a senha.')).toBeInTheDocument();
        });
    });
});
