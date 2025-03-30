// import { Outlet } from "react-router-dom";
import UsefulTable from "../components/UsefulTable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import { getDate } from "../components/misc";
import axios from "axios";
import EntitiesForm from "../components/Forms/EntitiesForm";
import InvoicesUpdateForm from "../components/Forms/InvoicesUpdateForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import BackWTitle from "../components/BackWTitle";
import ProForm from "../components/Forms/ProForm";
import SpecializedNav from "../components/SpecializedNav";
import ProUpdateForm from "../components/Forms/ProUpdateForm";

const right = { link: "/traffic", text: "Promet" };

export const Finance = () => {
  const axiosPrivate = useAxiosPrivate();

  const entityHeaders = [
    { key: "name", label: "Ime" },
    { key: "city", label: "Kraj" },
    { key: "id", label: "" },
  ];
  const invoiceHeaders = [
    { key: "date", label: "Datum" },
    { key: "number", label: "Št", hideOnMobile: true },
    { key: "entity", label: "Plačnik" },
    { key: "amount", label: "Vsota" },
    { key: "status", label: "Status", hideOnMobile: true },
    { key: "id", label: "" },
  ];
  const proformaHeaders = [
    { key: "date", label: "Datum" },
    { key: "number", label: "Št", hideOnMobile: true },
    { key: "entity", label: "Naročnik" },
    { key: "amount", label: "Vsota", hideOnMobile: true },
    { key: "link", label: "Akcija" },
    { key: "id", label: "" },
  ];

  const [isInvoices, setIsInvoices] = useState<boolean>(true);
  const switchTable = () => {
    setIsInvoices(!isInvoices);
  };
  const buttonLabel = isInvoices ? "Ponudbe" : "Računi";

  const [invoices, setInvoices] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [proforma, setProforma] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // console.log(invoices);
  // console.log(entities);
  useEffect(() => {
    // Run both requests concurrently
    const fetchProforma = axiosPrivate.get("proforma");
    const fetchInvoices = axiosPrivate.get("invoices");
    const fetchEntities = axiosPrivate.get("entities/row");

    axios
      .all([fetchInvoices, fetchEntities, fetchProforma])
      .then(
        axios.spread((invoicesResponse, entitiesResponse, proformaResponse) => {
          setInvoices(invoicesResponse.data);
          setEntities(entitiesResponse.data);
          setProforma(proformaResponse.data);
          setLoading(false); // Set loading to false when both requests are complete
          console.log(proformaResponse.data);
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
      <SpecializedNav text={buttonLabel} right={right} onClick={switchTable} />
      <div className="grid-3">
        <div className="span2">
          {isInvoices ? (
            <UsefulTable
              headers={invoiceHeaders}
              rows={invoices}
              title="Računi"
              // buttonText="Ustvari račun"
              // buttonLink="/invoices/create"
              linkPart="invoices"
            />
          ) : (
            <UsefulTable
              headers={proformaHeaders}
              rows={proforma}
              title="Ponudbe"
              buttonText="Ustvari ponudbo"
              buttonLink="/proforma/create"
              linkPart="proforma"
              wordLink="Ustvari račun"
            />
          )}
        </div>
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
      .get(`entities/${id}`)
      .then((response) => {
        setEntity(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!entity) {
    return <Loading />;
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi entiteto" />
      <div className="res-width-40">
        <EntitiesForm entity={entity} />
      </div>
    </div>
  );
};

export const CreateProforma = () => {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Ustvari ponudbo" />
      <div className="res-width-40">
        <ProForm />;
      </div>
    </div>
  );
};

export const UpdateProforma = () => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const [proforma, setProforma] = useState<any>();

  useEffect(() => {
    axiosPrivate.get(`proforma/${id}`).then((response) => {
      setProforma(response.data);
      // console.log(response.data);
    });
  }, [id]);

  if (!proforma) {
    return <Loading />;
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi ponudbo" />
      <div className="res-width-40">
        <ProUpdateForm proforma={proforma} />
      </div>
    </div>
  );
};

export const CreateInvoice = () => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const [proforma, setProforma] = useState<any>();

  useEffect(() => {
    axiosPrivate.get(`proforma/${id}`).then((response) => {
      const proformaData = response.data;
      proformaData.issueDate = getDate();
      setProforma(proformaData);
    });
  }, [id]);

  if (!proforma) {
    return <Loading />;
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Ustvari račun" />
      <div className="res-width-40">
        <InvoicesUpdateForm invoice={proforma} />
      </div>
    </div>
  );
};

export const UpdateInvoice = () => {
  const axiosPrivate = useAxiosPrivate();
  const [invoice, setInvoice] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    axiosPrivate.get(`invoices/${id}`).then((response) => {
      setInvoice(response.data);
    });
  }, [id]);

  if (!invoice) {
    return <Loading />;
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi račun" />
      <div className="res-width-40">
        <InvoicesUpdateForm invoice={invoice} />
      </div>
    </div>
  );
};
