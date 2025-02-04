// import { Outlet } from "react-router-dom";
import UsefulTable from "../components/UsefulTable";
import axios from "axios";
import { useEffect, useState } from "react";
import EntitiesForm from "../components/Forms/EntitiesForm";
import { useParams } from "react-router-dom";
import InvoicesForm from "../components/Forms/InvoicesForm";
import InvoicesUpdateForm from "../components/Forms/InvoicesUpdateForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const Invoices = () => {
  const axiosPrivate = useAxiosPrivate();

  const entityHeaders = ["Ime", "Kraj", ""];
  const invoiceHeaders = [
    "Št.",
    "Entiteta",
    "Vsota",
    "Storitev",
    "Status",
    "Datum",
    "",
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="background padding-3">
      <div className="grid-3">
        <div className="span2 grid-3-item">
          <UsefulTable
            headers={invoiceHeaders}
            rows={invoices}
            title="Računi"
            buttonText="Ustvari račun"
            buttonLink="/invoices/create"
            linkIndex={6}
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
            linkIndex={2}
            linkPart="entities"
          />
          {/* <Outlet /> */}
        </div>
      </div>
    </div>
  );
};

export const CreateEntity = () => {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="width-50">
        <h1 className="text-center bright-text">Dodaj entiteto</h1>
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
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  return (
    <div className="background padding-3 flex justify-center">
      <div className="width-50">
        <h1 className="text-center bright-text">Uredi entiteto</h1>
        <EntitiesForm
          name={entity.name}
          address={entity.address}
          postal={entity.postal}
          place={entity.place}
          iban={entity.iban}
          note={entity.note}
        />
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
    return <div>Loading...</div>;
  }

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width">
        <h1 className="text-center bright-text">Uredi račun</h1>
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
    <div className="background padding-3 flex justify-center">
      <div className="res-width">
        <h1 className="text-center bright-text">Ustvari račun</h1>
        <InvoicesForm entities={entities} />
      </div>
    </div>
  );
};
