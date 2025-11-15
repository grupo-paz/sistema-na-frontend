import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminMeetings from '../admin-meetings';
import * as services from '../../../../services';

jest.mock('../../../../services', () => ({
    getMeetings: jest.fn(),
    removeMeeting: jest.fn(),
}));

jest.mock('../../../../components', () => ({
    Loading: () => <div data-testid="loading">Loading...</div>,
    AdminHeader: () => <div data-testid="admin-header">AdminHeader</div>,
    withConfirmModal: (Component: any) => (props: any) => <Component {...props} showConfirm={mockShowConfirm} />,
}));

jest.mock('../components', () => ({
    MeetingsForm: () => <div data-testid="meetings-form">Meetings Form</div>,
    MeetingsList: () => <div data-testid="meetings-list">Meetings List</div>,
}));

const mockServices = services as jest.Mocked<typeof services>;
const mockShowConfirm = jest.fn();

const mockMeeting = {
    id: 'meeting-1',
    dayOfWeek: 'Segunda-feira',
    time: '10:00',
    endTime: '11:30',
    type: 'Presencial',
    category: 'Reunião de Equipe',
    roomOpener: 'João Silva',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-01T10:00:00Z',
    authorId: 'author-1',
    author: { name: 'Test Author' }
};

describe('AdminMeetings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockServices.getMeetings.mockResolvedValue([mockMeeting]);
    });

    it('should render main components', async () => {
        render(<AdminMeetings />);

        expect(screen.getByTestId('admin-header')).toBeInTheDocument();
        expect(screen.getByText('Reuniões')).toBeInTheDocument();
        expect(screen.getByTestId('meetings-form')).toBeInTheDocument();
        expect(screen.getByTestId('meetings-list')).toBeInTheDocument();
    });

    it('should load meetings on mount', async () => {
        render(<AdminMeetings />);

        await waitFor(() => {
            expect(mockServices.getMeetings).toHaveBeenCalledTimes(1);
        });
    });

    it('should show loading state', () => {
        mockServices.getMeetings.mockImplementation(() => new Promise(() => {}));
        render(<AdminMeetings />);

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should handle getMeetings error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockServices.getMeetings.mockRejectedValue(new Error('Load failed'));

        render(<AdminMeetings />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar reuniões:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });
});
