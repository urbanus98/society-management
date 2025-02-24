import UsefulTable from "../components/UsefulTable";
import EventsForm from "../components/Forms/EventsForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Loading } from "../components/Loading";
import BackWTitle from "../components/BackWTitle";

export function Events() {
  const axiosPrivate = useAxiosPrivate();
  const [events, setEvents] = useState<any[]>([]);
  const headers = [
    { key: "date", label: "Datum" },
    { key: "name", label: "Dogodek" },
    { key: "id", label: "" },
  ];

  useEffect(() => {
    const getEvents = async () => {
      const response = await axiosPrivate.get("events");
      setEvents(response.data);
    };

    getEvents();
  }, []);

  return (
    <div className="padding-3 flex justify-center align-center">
      <div className="res-width-80">
        <UsefulTable
          headers={headers}
          rows={events}
          title="Dogodki"
          buttonText="Dodaj dogodek"
          buttonLink="/events/create"
          linkPart="events"
        />
      </div>
    </div>
  );
}

export function CreateEvent() {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Ustvari dogodek" />
      <div className="res-width-30">
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
    return <Loading />; // Display a loading indicator while fetching data
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi dogodek" />
      <div className="res-width-30">
        <EventsForm event={event} />
      </div>
    </div>
  );
}
