import React from 'react';
import { render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../components/header', () => ({
    Header: () => ({
            type: 'div',
            props: { 'data-testid': 'header', children: 'Header' },
            key: null,
            ref: null,
            $$typeof: Symbol.for('react.element')
        }),
}));

describe('Home', () => {
    const renderComponent = () => {
        const { Home } = require('../home');
        return render(React.createElement(Home));
    };

    describe('when rendered', () => {
        beforeEach(() => {
            renderComponent();
        });

        it('should render header', () => {
            expect(screen.getByTestId('header')).toBeInTheDocument();
        });
    });

   
});
