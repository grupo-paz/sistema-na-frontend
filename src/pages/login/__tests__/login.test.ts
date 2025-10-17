import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { login, authStorage } from '../../../services';

const mockNavigate = jest.fn();

jest.mock('../../../services', () => ({
    login: jest.fn(),
    authStorage: {
        getAccessToken: jest.fn(),
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock o Header
jest.mock('../../../components/header/header', () => ({
    Header: function MockHeader() {
        return {
            $$typeof: Symbol.for('react.element'),
            type: 'div',
            key: null,
            ref: null,
            props: { 'data-testid': 'header', children: 'Mock Header' }
        };
    }
}));

const renderLoginPage = () => {
    const LoginPageComponent = require('../login').LoginPage;
    const { BrowserRouter: Router } = require('react-router-dom');

    return render(
        React.createElement(Router, null,
            React.createElement(LoginPageComponent)
        )
    );
};

const fillLoginForm = (email: string, password: string) => {
    const emailInput = screen.getByPlaceholderText('Login');
    const passwordInput = screen.getByPlaceholderText('Senha');

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });

    return { emailInput, passwordInput };
};

const submitForm = () => {
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);
    return submitButton;
};

const expectErrorMessage = async (message: string) => {
    await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
    });
};

const expectLoadingState = () => {
    expect(screen.getByText('Entrando...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
};

const expectLoginServiceCall = async (email: string, password: string) => {
    await waitFor(() => {
        expect(login).toHaveBeenCalledWith(email, password);
    });
};

const expectNoErrorMessage = async (message: string) => {
    await waitFor(() => {
        expect(screen.queryByText(message)).not.toBeInTheDocument();
    });
};

const createDelayedPromise = (delay = 100) => {
    return new Promise(resolve => {
        setTimeout(() => resolve({ accessToken: 'mock-token' }), delay);
    });
};

const mockDelayedLogin = () => {
    const delayedPromise = createDelayedPromise(100);
    return delayedPromise;
};

describe('LoginPage', () => {
    describe('when rendered', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            (authStorage.getAccessToken as jest.Mock).mockReturnValue(null);
        });

        describe('and component mounts', () => {
            beforeEach(() => {
                renderLoginPage();
            });


            it('should display login form elements', () => {
                expect(screen.getByText('Adm Grupo Paz')).toBeInTheDocument();
                expect(screen.getByPlaceholderText('Login')).toBeInTheDocument();
                expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
                expect(screen.getByTestId('header')).toBeInTheDocument();
            });

            it('should have proper input attributes', () => {
                const emailInput = screen.getByPlaceholderText('Login');
                const passwordInput = screen.getByPlaceholderText('Senha');

                expect(emailInput).toHaveAttribute('type', 'email');
                expect(emailInput).toHaveAttribute('required');
                expect(emailInput).toHaveAttribute('aria-label', 'Email');

                expect(passwordInput).toHaveAttribute('type', 'password');
                expect(passwordInput).toHaveAttribute('required');
                expect(passwordInput).toHaveAttribute('aria-label', 'Senha');
            });
        });

        describe('and user interacts with form', () => {
            beforeEach(() => {
                renderLoginPage();
            });

            it('should update email input value when typed', () => {
                const emailInput = screen.getByPlaceholderText('Login');
                fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
                expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
            });

            it('should update password input value when typed', () => {
                const passwordInput = screen.getByPlaceholderText('Senha');
                fireEvent.change(passwordInput, { target: { value: 'password123' } });
                expect((passwordInput as HTMLInputElement).value).toBe('password123');
            });

            it('should handle form submission correctly', async () => {
                (login as jest.Mock).mockResolvedValue({ accessToken: 'mock-token' });
                fillLoginForm('admin@test.com', 'password123');
                submitForm();

                await expectLoginServiceCall('admin@test.com', 'password123');
            });
        });

        describe('and form is submitted successfully', () => {
            beforeEach(() => {
                renderLoginPage();
            });

            it('should call login service with correct credentials', async () => {
                (login as jest.Mock).mockResolvedValue({ accessToken: 'mock-token' });
                fillLoginForm('admin@test.com', 'password123');
                submitForm();

                await expectLoginServiceCall('admin@test.com', 'password123');
            });

            it('should show loading state during submission', async () => {
                (login as jest.Mock).mockImplementation(mockDelayedLogin);

                fillLoginForm('admin@test.com', 'password123');
                submitForm();

                expectLoadingState();
            });

            it('should clear error state when submitting', async () => {
                const errorResponse = new Error(JSON.stringify({ error: 'Previous error' }));
                (login as jest.Mock).mockRejectedValueOnce(errorResponse)
                    .mockResolvedValue({ accessToken: 'mock-token' });

                fillLoginForm('admin@test.com', 'wrong-password');
                submitForm();

                await expectErrorMessage('Previous error');

                fireEvent.change(screen.getByPlaceholderText('Senha'), {
                    target: { value: 'correct-password' }
                });
                submitForm();

                await expectNoErrorMessage('Previous error');
            });
        });

        describe('and form submission fails', () => {
            beforeEach(() => {
                renderLoginPage();
            });

            it('should display error message from API response', async () => {
                const errorMessage = 'Credenciais inválidas';
                const errorResponse = new Error(JSON.stringify({ error: errorMessage }));
                (login as jest.Mock).mockRejectedValue(errorResponse);

                fillLoginForm('admin@test.com', 'wrong-password');
                submitForm();

                await expectErrorMessage(errorMessage);
                expect(screen.getByText(errorMessage)).toHaveClass('login-error');
            });

            it('should display default error message when API error has no message', async () => {
                const networkError = new Error('{}');
                (login as jest.Mock).mockRejectedValue(networkError);

                fillLoginForm('admin@test.com', 'password123');
                submitForm();

                await expectErrorMessage('Falha no login');
            });

            it('should restore button state after error', async () => {
                const errorResponse = new Error(JSON.stringify({ error: 'Login failed' }));
                (login as jest.Mock).mockRejectedValue(errorResponse);

                fillLoginForm('admin@test.com', 'password123');
                const submitButton = submitForm();

                await expectErrorMessage('Login failed');
                expect(submitButton).not.toBeDisabled();
                expect(screen.getByText('Entrar')).toBeInTheDocument();
            });
        });

        describe('and user is already authenticated', () => {
            beforeEach(() => {
                (authStorage.getAccessToken as jest.Mock).mockReturnValue('existing-token');
                renderLoginPage();
            });

            it('should redirect to admin page when access token exists', () => {
                expect(mockNavigate).toHaveBeenCalledWith('/admin');
            });
        });

        describe('and accessibility features', () => {
            beforeEach(() => {
                renderLoginPage();
            });

            it('should have proper form structure', () => {
                const form = screen.getByRole('button', { name: /entrar/i }).closest('form');
                expect(form).toBeInTheDocument();
                expect(form).toHaveAttribute('class', 'login-form');
            });

            it('should have proper heading hierarchy', () => {
                const heading = screen.getByRole('heading', { level: 2 });
                expect(heading).toHaveTextContent('Adm Grupo Paz');
            });

            it('should have proper input labels', () => {
                expect(screen.getByLabelText('Email')).toBeInTheDocument();
                expect(screen.getByLabelText('Senha')).toBeInTheDocument();
            });
        });
    });
});