import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../../../../widgets/header/header', () => ({
    Header: () => ({
        type: 'div',
        props: { 'data-testid': 'header', children: 'Header' },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
    }),
}));

describe('AdminProfile', () => {
    const renderComponent = () => {
        const { AdminProfile } = require('../admin-profile');
        return render(React.createElement(AdminProfile));
    };

    it('should render header and profile info', () => {
        renderComponent();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Perfil (to-do)')).toBeInTheDocument();
    });
});
