// import { Outlet } from "react-router-dom";
import UsefulTable from "../components/UsefulTable";
import axios from "axios";
import { useEffect, useState } from "react";
import EntitiesForm from "../components/EntitiesForm";
import { useParams } from "react-router-dom";
import InvoicesForm from "../components/InvoicesForm";
import InvoicesUpdateForm from "../components/InvoicesUpdateForm";

export const Invoices = () => {
  const entityHeaders = ["Ime", "Kraj", "Uredi"];
  const invoiceHeaders = [
    "Št.",
    "Entiteta",
    "Vsota",
    "Storitev",
    "Status",
    "Datum",
    "Uredi",
  ];

  const [invoices, setInvoices] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // console.log(invoices);
  // console.log(entities);
  useEffect(() => {
    // Run both requests concurrently
    const fetchInvoices = axios.get("http://localhost:8081/invoices-row");
    const fetchEntities = axios.get("http://localhost:8081/entities-row");

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
  }, []); // Empty dependency array to only run once when component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8081/entities")
  //     .then((response) => {
  //       setEntities(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  return (
    <div className="background padding-3">
      <div className="grid">
        <div className="span2 grid-item">
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
        <div className="grid-item">
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

// function formatInvoices(invoices: any[]) {
//   const rows = invoices.map((row) => {
//     return [
//       row.number,
//       row.payer_id,
//       row.receiver_id,
//       row.status,
//       row.issue_date,
//     ];
//   });
//   return rows;
// }

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
  const [entity, setEntity] = useState<any>();
  const { id } = useParams(); // Add this line to get the id from the URL

  useEffect(() => {
    axios
      .get(`http://localhost:8081/entities/${id}`) // Use the id from the URL
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
  const [invoice, setInvoice] = useState<any>();
  const [entities, setEntities] = useState<any[]>([]);
  const { id } = useParams();

  console.log(invoice);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/invoices/${id}`)
      .then((response) => {
        setInvoice(response.data[0]);
        // Once invoices are fetched, fetch entities
        return axios.get("http://localhost:8081/entities");
      })
      .then((response) => {
        setEntities(response.data);
      });
  }, [id]);

  if (!invoice) {
    return <div>Loading...</div>; // Display a loading indicator while fetching data
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
  const [entities, setEntities] = useState<any[]>([]);

  const fetchEntities = axios.get("http://localhost:8081/entities");
  console.log(entities);

  useEffect(() => {
    axios
      .all([fetchEntities])
      .then(
        axios.spread((entitiesResponse) => {
          setEntities(entitiesResponse.data);
        })
      )
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width">
        <h1 className="text-center bright-text">Ustvari račun</h1>
        <InvoicesForm entities={entities} />
      </div>
    </div>
  );
};
