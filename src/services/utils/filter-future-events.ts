import { Event } from "../index";
    
export const filterFutureEvents = async (eventList: Event[]): Promise<Event[]> => {
    const now = new Date();
    const futureEvents: Event[] = [];

    for (const event of eventList) {
        const eventDate = new Date(event.dateTime);
        if (eventDate > now) {
            futureEvents.push(event);
        }
    }

    return futureEvents;
};