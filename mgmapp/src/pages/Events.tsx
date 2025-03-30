import UsefulTable from "../components/UsefulTable";
import EventsForm from "../components/Forms/EventsForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Loading } from "../components/Loading";
import BackWTitle from "../components/BackWTitle";
import SubNavigator from "../components/SubNavigator";
import TripsForm from "../components/Forms/TripsForm";
import Alert from "../components/ui/Alert";
import EventInvoiceForm from "../components/Forms/EventInvoiceForm";

export function Events() {
  const axiosPrivate = useAxiosPrivate();
  const [events, setEvents] = useState<any[]>([]);
  const left = { link: "/data-management", text: "Upr. pod." };
  const right = { link: "/trips", text: "Poti" };
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
    <div className="padding-3 coluflex justify-center align-center">
      <SubNavigator title="Dogodki" left={left} right={right} />
      <div className="res-width-80">
        <UsefulTable
          headers={headers}
          rows={events}
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
      <div className="res-width-40">
        <EventsForm />
      </div>
    </div>
  );
}

export function UpdateEvent() {
  const axiosPrivate = useAxiosPrivate();
  const [event, setEvent] = useState<any>();
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [alertColor, setAlertColor] = useState<any>("success");
  const [alertVisible, setAlertVisibility] = useState(false);

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
      <div className="res-width-40">
        <EventsForm event={event} />

        {alertVisible && (
          <Alert color={alertColor} onClose={() => setAlertVisibility(false)}>
            {msg}
          </Alert>
        )}

        <EventInvoiceForm
          event={event}
          setMsg={setMsg}
          setAlertVisibility={setAlertVisibility}
          setAlertColor={setAlertColor}
        />

        <TripsForm
          eventId={id}
          setMsg={setMsg}
          setAlertVisibility={setAlertVisibility}
          setAlertColor={setAlertColor}
        />
      </div>
    </div>
  );
}
