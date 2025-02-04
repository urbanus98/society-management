import UsefulTable from "../components/UsefulTable";
import EventsForm from "../components/Forms/EventsForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export function Events() {
  const axiosPrivate = useAxiosPrivate();
  const eventHeaders = ["Dogodek", "Datum", "Uredi"];
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      const response = await axiosPrivate.get("events");
      setEvents(response.data);
    };

    getEvents();
  }, []);

  return (
    <div className="background padding-3">
      <UsefulTable
        headers={eventHeaders}
        rows={events}
        title="Dogodki"
        buttonText="Dodaj dogodek"
        buttonLink="/events/create"
        linkIndex={2}
        linkPart="events"
      />
    </div>
  );
}

export function CreateEvent() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Ustvari dogodek</h1>
        <EventsForm />
      </div>
    </div>
  );
}

export function UpdateEvent() {
  const axiosPrivate = useAxiosPrivate();
  const [event, setEvent] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    const getEvent = async () => {
      const response = await axiosPrivate.get(`events/${id}`);
      setEvent(response.data);
      // console.log(response.data);
    };

    getEvent();
  }, []);

  if (!event) {
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Uredi dogodek</h1>
        <EventsForm event={event} />
      </div>
    </div>
  );
}
