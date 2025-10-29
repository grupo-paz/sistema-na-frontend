import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockGetSecretary = jest.fn();
const mockUpdateSecretary = jest.fn();
const mockShowConfirm = jest.fn();
const mockReact = React;

jest.mock('../../../../services', () => ({
    getSecretary: () => mockGetSecretary(),
    updateSecretary: (data: any) => mockUpdateSecretary(data),
    formatDate: jest.fn((date) => `Formatted: ${date}`),
    formatMoney: jest.fn((amount) => `R$ ${amount.toFixed(2)}`),
}));

jest.mock('../../../../components', () => ({
    Loading: () => mockReact.createElement('div', { 'data-testid': 'loading' }, 'Loading...'),
    AdminHeader: () => mockReact.createElement('div', { 'data-testid': 'admin-header' }, 'AdminHeader'),
    withConfirmModal: (Component: React.ComponentType) => (props: any) => 
        mockReact.createElement(Component, { ...props, showConfirm: mockShowConfirm }),
    ConfirmModalOptions: {},
}));

describe('AdminSecretary', () => {
    const mockSecretaryData = {
        pixValue: 1000.5,
        cashValue: 500.25,
        createdAt: '2023-10-15T14:30:45.000Z',
        author: { name: 'Test Admin' }
    };

    const renderComponent = () => {
        const AdminSecretary = require('../admin-secretary').default;
        return render(React.createElement(AdminSecretary));
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch and display secretary data on mount', async () => {
        mockGetSecretary.mockResolvedValue(mockSecretaryData);
        
        renderComponent();
        
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
        
        expect(mockGetSecretary).toHaveBeenCalledTimes(1);
    });

    it('should show error message when data fetch fails', async () => {
        mockGetSecretary.mockRejectedValue(new Error('Network error'));
        
        renderComponent();
        
        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
        
        expect(screen.getByText('Erro ao carregar dados da secretaria.')).toBeInTheDocument();
    });

    it('should show update form when update button is clicked', async () => {
        mockGetSecretary.mockResolvedValue(mockSecretaryData);
        
        renderComponent();
        
        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
        
        const updateButton = screen.getByText('Atualizar Valores');
        fireEvent.click(updateButton);
        
        expect(screen.getByLabelText('Valor Pix')).toBeInTheDocument();
        expect(screen.getByLabelText('Valor Dinheiro')).toBeInTheDocument();
    });

    it('should handle null secretary data gracefully', async () => {
        mockGetSecretary.mockResolvedValue(null);
        
        renderComponent();
        
        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
        
        expect(screen.getByText('Não disponível')).toBeInTheDocument();
    });
});
