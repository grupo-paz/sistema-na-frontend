import { Meeting } from "../../services/types";
import "./stylesheets/meeting-card.css";

interface MeetingCardProps {
    meeting: Meeting;
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
    return (
        <div className="meeting-card">
            <div className="meeting-card-category">Reunião de {meeting.category}</div>
            <div className="meeting-card-time">{meeting.time}</div>
            <div className="meeting-card-type">{meeting.type}</div>
            <div className="meeting-card-opener"> Abridor: {meeting.roomOpener} </div>
        </div>
    );
};
