import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

const mockGetSecretary = jest.fn();
const mockFormatMoney = jest.fn();
const mockFormatDate = jest.fn();

jest.mock('../../../services/secretary', () => ({
    getSecretary: (...args: any[]) => mockGetSecretary(...args)
}));

jest.mock('../../../services/utils/format-money', () => ({
    formatMoney: (...args: any[]) => mockFormatMoney(...args)
}));

jest.mock('../../../services', () => ({
    formatDate: (...args: any[]) => mockFormatDate(...args)
}));

jest.mock('../../../components/header', () => ({
    Header: () => ({
        type: 'div',
        props: { 'data-testid': 'header', children: 'Header' },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
    })
}));

jest.mock('../../../components/loading', () => ({
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

describe('SecretaryPage', () => {
    const mockSecretaryData = {
        cashValue: 2000,
        pixValue: 50000,
        createdAt: '2025-10-29T10:30:00Z',
        author: {
            id: '123',
            name: 'Admin Teste',
            email: 'admin@teste.com'
        }
    };

    const renderComponent = () => {
        const { SecretaryPage } = require('../secretary');
        return render(React.createElement(SecretaryPage));
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockFormatMoney.mockImplementation((value) => `R$ ${value.toFixed(2).replace('.', ',')}`);
        mockFormatDate.mockImplementation(() => '29/10/2025');
    });

    describe('when rendered', () => {
        it('should render header', async () => {
            mockGetSecretary.mockResolvedValue(mockSecretaryData);
            renderComponent();
            expect(screen.getByTestId('header')).toBeInTheDocument();
        });

        it('should show loading initially', () => {
            mockGetSecretary.mockResolvedValue(mockSecretaryData);
            renderComponent();
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });
    });

    describe('when data loads successfully', () => {
        beforeEach(() => {
            mockGetSecretary.mockResolvedValue(mockSecretaryData);
        });

        it('should render page title', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Secretaria'));
            expect(screen.getByText('Secretaria')).toBeInTheDocument();
        });

        it('should display pix value correctly', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Pix'));
            expect(screen.getByText('Pix')).toBeInTheDocument();
            expect(mockFormatMoney).toHaveBeenCalledWith(50000);
        });

        it('should display cash value correctly', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Dinheiro'));
            expect(screen.getByText('Dinheiro')).toBeInTheDocument();
            expect(mockFormatMoney).toHaveBeenCalledWith(2000);
        });

        it('should display last update information', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Última atualização'));
            expect(screen.getByText('Última atualização')).toBeInTheDocument();
            expect(mockFormatDate).toHaveBeenCalledWith('2025-10-29T10:30:00Z');
        });

        it('should display author name', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Por: Admin Teste'));
            expect(screen.getByText('Por: Admin Teste')).toBeInTheDocument();
        });

        it('should call getSecretary service on mount', async () => {
            renderComponent();
            await waitFor(() => expect(mockGetSecretary).toHaveBeenCalledTimes(1));
        });

        it('should hide loading after data loads', async () => {
            renderComponent();
            await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
        });
    });

    describe('when data loading fails', () => {
        beforeEach(() => {
            mockGetSecretary.mockRejectedValue(new Error('API Error'));
        });

        it('should display error message', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Erro ao carregar os dados da secretaria'));
            expect(screen.getByText('Erro ao carregar os dados da secretaria')).toBeInTheDocument();
        });

        it('should still render header on error', async () => {
            renderComponent();
            await waitFor(() => screen.getByTestId('header'));
            expect(screen.getByTestId('header')).toBeInTheDocument();
        });

        it('should hide loading on error', async () => {
            renderComponent();
            await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
        });

        it('should not display secretary data on error', async () => {
            renderComponent();
            await waitFor(() => expect(screen.queryByText('Erro ao carregar os dados da secretaria')).toBeInTheDocument());
            expect(screen.queryByText('Pix')).not.toBeInTheDocument();
            expect(screen.queryByText('Dinheiro')).not.toBeInTheDocument();
        });
    });

    describe('when secretary data is null', () => {
        beforeEach(() => {
            mockGetSecretary.mockResolvedValue(null);
        });

        it('should display default values for money', async () => {
            renderComponent();
            await waitFor(() => screen.getAllByText('R$ 0,00'));
            const defaultValues = screen.getAllByText('R$ 0,00');
            expect(defaultValues).toHaveLength(2); // One for Pix, one for Dinheiro
        });

        it('should not display last update section', async () => {
            renderComponent();
            await waitFor(() => expect(screen.queryByText('Última atualização')).not.toBeInTheDocument());
        });
    });

    describe('when secretary data has missing author', () => {
        beforeEach(() => {
            mockGetSecretary.mockResolvedValue({
                ...mockSecretaryData,
                author: null
            });
        });

        it('should display fallback text for author', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Por: Usuário não identificado'));
            expect(screen.getByText('Por: Usuário não identificado')).toBeInTheDocument();
        });
    });

    describe('when secretary data has missing createdAt', () => {
        beforeEach(() => {
            mockGetSecretary.mockResolvedValue({
                ...mockSecretaryData,
                createdAt: null
            });
        });

        it('should display fallback text for date', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Não disponível'));
            expect(screen.getByText('Não disponível')).toBeInTheDocument();
        });
    });
});
