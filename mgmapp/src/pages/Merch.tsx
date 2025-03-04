import UsefulTable from "../components/UsefulTable";
import LinkButton from "../components/ui/LinkButton";
import MerchForm from "../components/Forms/MerchForm";
import Item from "../components/Item";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrdersForm from "../components/Forms/OrdersForm";
import SalesForm from "../components/Forms/SalesForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SubNavigator from "../components/SubNavigator";
import { Loading } from "../components/Loading";
import BackWTitle from "../components/BackWTitle";
import FuncButton from "../components/ui/FuncButton";

export function Merch() {
  const axiosPrivate = useAxiosPrivate();
  const [merch, setMerch] = useState<any[]>([]);
  const left = { link: "/merch/orders", text: "Naročila" };
  const right = { link: "/merch/sales", text: "Prodaja" };
  const [showUnsellable, setShowUnsellable] = useState<boolean>(false);
  const filteredMerch = showUnsellable
    ? merch
    : merch.filter((item) => item.isSold);

  useEffect(() => {
    axiosPrivate
      .get(`merch`)
      .then((response) => {
        setMerch(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!merch) {
    return <Loading />;
  }
  // console.log(merch);
  return (
    <div className="padding-3 coluflex align-center">
      <SubNavigator left={left} right={right} title="Merch" margin />
      <div className="flex justify-between res-width-40">
        <LinkButton link="/merch/create" text="Dodaj Merch" />
        {/* <Link to="/merch/create" className="bright-text">
          <p className="link_text">Dodaj merch &rarr;</p>
        </Link> */}
        <FuncButton
          color="secondary"
          onClick={() => setShowUnsellable(!showUnsellable)}
        >
          {showUnsellable ? "Skrij privat" : "Pokaži vse"}
        </FuncButton>
      </div>
      <div className="flex wrap justify-center res-width-80">
        {filteredMerch.map((item) => (
          <Item item={item} linkPart="merch" key={item.id} />
        ))}
      </div>
    </div>
  );
}

export function CreateMerch() {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Dodaj merch" />
      <div className="res-width-30">
        <MerchForm />
      </div>
    </div>
  );
}

export function UpdateMerch() {
  const axiosPrivate = useAxiosPrivate();
  const [merch, setMerch] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    axiosPrivate
      .get(`merch/${id}`)
      .then((response) => {
        setMerch(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!merch) {
    return <Loading />;
  }
  // console.log(merch);
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi merch" />
      <div className="res-width-30">
        <MerchForm item={merch} />
      </div>
    </div>
  );
}

export function MerchOrders() {
  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState<any[]>([]);
  const left = { link: "/merch/sales", text: "Prodaja" };
  const right = { link: "/merch", text: "Merch" };
  const headers = [
    { key: "date", label: "Datum" },
    { key: "price", label: "Cena" },
    // { key: "file", label: "Račun" },
    { key: "id", label: "" },
  ];

  useEffect(() => {
    axiosPrivate
      .get(`orders`)
      .then((response) => {
        // console.log(response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!orders) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <SubNavigator left={left} right={right} />
      <div className="res-width-80">
        <UsefulTable
          title="Naročila"
          headers={headers}
          rows={orders}
          buttonLink="/merch/orders/create"
          buttonText="Zabeleži"
          linkPart="merch/orders"
        />
      </div>
    </div>
  );
}

export function CreateOrder() {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Vnesi naročilo" />
      <div className="res-width-30">
        <OrdersForm />
      </div>
    </div>
  );
}

export function UpdateOrder() {
  const axiosPrivate = useAxiosPrivate();
  const [orderData, setOrderData] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    axiosPrivate
      .get(`orders/${id}`)
      .then((response) => {
        setOrderData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!orderData) {
    // If there is no data, return a loading indicator
    return <Loading />; // Display a loading indicator while fetching data
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi naročilo" />
      <div className="res-width-30">
        <OrdersForm order={orderData} />
      </div>
    </div>
  );
}

export function MerchSales() {
  const axiosPrivate = useAxiosPrivate();
  const [sales, setSales] = useState<any[]>([]);
  const left = { link: "/merch", text: "Merch" };
  const right = { link: "/merch/orders", text: "Naročila" };
  const headers = [
    { key: "date", label: "Datum" },
    { key: "price", label: "Zaslužek" },
    { key: "id", label: "" },
  ];

  useEffect(() => {
    axiosPrivate
      .get(`sales`) // Use the id from the URL
      .then((response) => {
        console.log(response.data);
        setSales(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!sales) {
    return <Loading />;
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <SubNavigator left={left} right={right} />
      <div className="res-width-80">
        <UsefulTable
          headers={headers}
          rows={sales}
          title="Prodaja mercha"
          buttonText="Zabeleži"
          buttonLink="create"
          linkPart="merch/sales"
        />
      </div>
    </div>
  );
}

export function CreateSale() {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Prodaj merch" />
      <div className="res-width-30">
        <SalesForm />
      </div>
    </div>
  );
}

export function UpdateSale() {
  const axiosPrivate = useAxiosPrivate();
  const [sale, setSale] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    axiosPrivate
      .get(`sales/${id}`)
      .then((response) => {
        console.log(response.data);
        setSale(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!sale) {
    // If there is no data, return a loading indicator
    return <Loading />; // Display a loading indicator while fetching data
  }

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi prodajo" />
      <div className="res-width-30">
        <SalesForm sale={sale} />
      </div>
    </div>
  );
}
