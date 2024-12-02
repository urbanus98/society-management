import UsefulTable from "../components/UsefulTable";
import EventsForm from "../components/Forms/EventsForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  const [event, setEvent] = useState<any[]>([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8081/events/${id}`)
      .then((response) => response.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error(error));
  }, [id]);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:8081/events/${id}`) // Use the id from the URL
  //     .then((response) => {
  //       setEvent(response.data[0]);
  //       console.log(response.data[0]);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, [id]);

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Uredi dogodek</h1>
        <EventsForm event={event} />
      </div>
    </div>
  );
}

export function Events() {
  const eventHeaders = ["Dogodek", "Datum", "Uredi"];
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/events-row")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error(error));
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
