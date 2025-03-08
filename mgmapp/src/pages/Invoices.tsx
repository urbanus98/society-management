// import { Outlet } from "react-router-dom";
import UsefulTable from "../components/UsefulTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import EntitiesForm from "../components/Forms/EntitiesForm";
import InvoicesUpdateForm from "../components/Forms/InvoicesUpdateForm";
import InvoicesForm from "../components/Forms/InvoicesForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SubNavigator from "../components/SubNavigator";
import BackWTitle from "../components/BackWTitle";

const left = { link: "/invoices", text: "Računi" };
const right = { link: "/traffic", text: "Promet" };

export const Invoices = () => {
  const axiosPrivate = useAxiosPrivate();

  const entityHeaders = [
    { key: "name", label: "Ime" },
    { key: "city", label: "Kraj" },
    { key: "id", label: "" },
  ];
  const invoiceHeaders = [
    { key: "date", label: "Datum" },
    { key: "number", label: "Št" },
    { key: "entity", label: "Entiteta" },
    { key: "amount", label: "Vsota" },
    { key: "status", label: "Status" },
    { key: "id", label: "" },
  ];

  const [invoices, setInvoices] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // console.log(invoices);
  // console.log(entities);
  useEffect(() => {
    // Run both requests concurrently
    const fetchInvoices = axiosPrivate.get("invoices");
    const fetchEntities = axiosPrivate.get("entities/row");

    axios
      .all([fetchInvoices, fetchEntities])
      .then(
        axios.spread((invoicesResponse, entitiesResponse) => {
          setInvoices(invoicesResponse.data);
          setEntities(entitiesResponse.data);
          setLoading(false); // Set loading to false when both requests are complete
        })
      )
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [axiosPrivate]); // Empty dependency array to only run once when component mounts

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="padding-3">
      <SubNavigator left={left} right={right} disabled={0b01} />
      <div className="grid-3">
        <div className="span2 grid-3-item">
          <UsefulTable
            headers={invoiceHeaders}
            rows={invoices}
            title="Računi"
            buttonText="Ustvari račun"
            buttonLink="/invoices/create"
            linkPart="invoices"
          />
        </div>
        <div className="grid-3-item">
          <UsefulTable
            headers={entityHeaders}
            rows={entities}
            title="Entitete"
            buttonText="Dodaj entiteto"
            buttonLink="/entities/create"
            linkPart="entities"
          />
        </div>
      </div>
    </div>
  );
};

export const CreateEntity = () => {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Dodaj entiteto" />
      <div className="res-width-40">
        <EntitiesForm />
      </div>
    </div>
  );
};

export const UpdateEntity = () => {
  const axiosPrivate = useAxiosPrivate();
  const [entity, setEntity] = useState<any>();
  const { id } = useParams(); // Add this line to get the id from the URL

  useEffect(() => {
    axiosPrivate
      .get(`entities/${id}`) // Use the id from the URL
      .then((response) => {
        console.log(response.data[0]);
        setEntity(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]); // Add id to the dependency array

  if (!entity) {
    return <Loading />; // Display a loading indicator while fetching data
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi entiteto" />
      <div className="width-50">
        <EntitiesForm entity={entity} />
      </div>
    </div>
  );
};

export const UpdateInvoice = () => {
  const axiosPrivate = useAxiosPrivate();
  const [invoice, setInvoice] = useState<any>();
  const [entities, setEntities] = useState<any[]>([]);
  const { id } = useParams();

  console.log(invoice);

  useEffect(() => {
    axiosPrivate
      .get(`http://localhost:8081/invoices/${id}`)
      .then((response) => {
        setInvoice(response.data[0]);
        // Once invoices are fetched, fetch entities
        return axiosPrivate.get("http://localhost:8081/entities");
      })
      .then((response) => {
        setEntities(response.data);
      });
  }, [id]);

  if (!invoice) {
    return <Loading />;
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi račun" />
      <div className="res-width-40">
        <InvoicesUpdateForm entities={entities} invoice={invoice} />
      </div>
    </div>
  );
};

export const CreateInvoice = () => {
  const axiosPrivate = useAxiosPrivate();
  const [entities, setEntities] = useState<any[]>([]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await axiosPrivate.get("entities");
        setEntities(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntities();
  }, [axiosPrivate]);

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Ustvari račun" />
      <div className="res-width-40">
        <InvoicesForm entities={entities} />
      </div>
    </div>
  );
};
