import React, { useEffect, useState } from "react";
import { Meeting, getMeetings, removeMeeting } from "../../../services";
import { Loading, AdminHeader, withConfirmModal, ConfirmModalOptions } from "../../../components";
import { MeetingsForm, MeetingsList } from "./components";

import "./stylesheets/admin-meetings.css";

const AdminMeetings: React.FC<{ showConfirm: (options: ConfirmModalOptions) => void }> = ({ showConfirm }) => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

    useEffect(() => {
        const loadMeetings = async () => {
            setLoading(true);
            try {
                const data = await getMeetings();
                setMeetings(data);
            } catch (error) {
                console.error("Erro ao carregar reuniões:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMeetings();
    }, []);

    useEffect(() => {
        if (showDeleteConfirmModal && selectedMeetingId) {
            const selectedMeeting = meetings.find(meeting => meeting.id === selectedMeetingId);
            showConfirm({
                title: "Confirmar Exclusão",
                message: `Tem certeza que deseja excluir a reunião "${selectedMeeting?.dayOfWeek} - ${selectedMeeting?.time}"?`,
                onConfirm: () => {
                    handleDeleteMeeting(selectedMeetingId);
                },
            });
        }
    }, [showDeleteConfirmModal, selectedMeetingId]);

    const handleDeleteMeeting = async (meetingId: string) => {
        setLoading(true);
        try {
            await removeMeeting(meetingId);
            const updated = await getMeetings();
            setMeetings(updated);
        } catch (error) {
            console.error("Erro ao deletar reunião:", error);
        } finally {
            setLoading(false);
            setSelectedMeetingId(null);
            setShowDeleteConfirmModal(false);
        }
    };

    const handleConfirmDelete = (meetingId: string) => {
        setSelectedMeetingId(meetingId);
        setShowDeleteConfirmModal(true);
    };

    return (
        <>
            {loading && <Loading />}
            <AdminHeader />
            <div className="page-content">
                <div className="meetings-page-header">
                    <h1>Reuniões</h1>
                </div>
                <MeetingsForm
                    setMeetings={setMeetings}
                />
                <MeetingsList
                    meetings={meetings}
                    setMeetings={setMeetings}
                    onConfirmDelete={handleConfirmDelete}
                />
            </div>
        </>
    );
};

export default withConfirmModal(AdminMeetings);
