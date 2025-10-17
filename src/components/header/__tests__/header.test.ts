import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/admin/perfil' };
const mockAuthStorage = {
    getAccessToken: jest.fn(),
    clear: jest.fn(),
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
}));

jest.mock('../../../services', () => ({
    authStorage: {
        getAccessToken: jest.fn(),
        clear: jest.fn(),
    },
}));

describe('Header', () => {
    const renderComponent = (isAuthenticated = true, pathname = '/admin/perfil') => {
        mockAuthStorage.getAccessToken.mockReturnValue(isAuthenticated ? 'token' : undefined);
        mockLocation.pathname = pathname;
        jest.requireMock('../../../services').authStorage.getAccessToken.mockReturnValue(isAuthenticated ? 'token' : undefined);
        const { Header } = require('../header');
        return render(React.createElement(Header));
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockReset();
    });

    describe('when rendered', () => {
        describe('and user is authenticated and on /admin', () => {
            it('should show admin navigation buttons', () => {
                renderComponent(true, '/admin/perfil');
                expect(screen.getByText('Perfil')).toBeInTheDocument();
                expect(screen.getByText('Administradores')).toBeInTheDocument();
                expect(screen.getByText('Sair')).toBeInTheDocument();
            });
            it('should call navigate when clicking navigation buttons', () => {
                renderComponent(true, '/admin/perfil');
                fireEvent.click(screen.getByText('Administradores'));
                expect(mockNavigate).toHaveBeenCalledWith('/admin/administradores');
                fireEvent.click(screen.getByText('Perfil'));
                expect(mockNavigate).toHaveBeenCalledWith('/admin/perfil');
            });
            it('should clear auth and navigate to /login on logout', () => {
                renderComponent(true, '/admin/perfil');
                fireEvent.click(screen.getByText('Sair'));
                expect(jest.requireMock('../../../services').authStorage.clear).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('/login');
            });
        });
        describe('and user is not authenticated and on /login', () => {
            it('should show Recuperar Senha button', () => {
                renderComponent(false, '/login');
                expect(screen.getByText('Recuperar Senha')).toBeInTheDocument();
            });
        });
        describe('and user is authenticated and on non-admin route', () => {
            it('should NOT show admin navigation buttons', () => {
                renderComponent(true, '/');
                expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
                expect(screen.queryByText('Administradores')).not.toBeInTheDocument();
                expect(screen.queryByText('Sair')).not.toBeInTheDocument();
            });
        });
    });
});
