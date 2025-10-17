import React from 'react';
import { render } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Admin', () => {
    it('should redirect to /admin/perfil on mount', () => {
        const mockNavigate = jest.fn();
        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
        const { Admin } = require('../admin');
        render(React.createElement(Admin));
        expect(mockNavigate).toHaveBeenCalledWith('/admin/perfil', { replace: true });
    });
});
