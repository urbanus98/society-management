import LinkButton from "../components/ui/LinkButton";
import MerchForm from "../components/Forms/MerchForm";
import { useEffect, useState } from "react";
import axios from "axios";
import Item from "../components/Item";
import { useParams } from "react-router-dom";
import DynamicTable from "../components/ui/DynamicTable";
import OrdersForm from "../components/Forms/OrdersForm";
import UsefulTable from "../components/UsefulTable";
import SalesForm from "../components/Forms/SalesForm";

export function Merch() {
  const [merch, setMerch] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/merch`) // Use the id from the URL
      .then((response) => {
        setMerch(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!merch) {
    // If there is no data, return a loading indicator
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }
  console.log(merch);
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-3">
        <h1 className="text-center bright-text">Merch</h1>
        <div className="flex justify-between">
          <LinkButton link="/merch/create" text="Create Merch" />
          <LinkButton link="/merch/orders" text="Merch Orders" />

          <LinkButton link="/merch/sales" text="Merch Sales" />
        </div>

        <div className="flex wrap justify-center">
          {merch.map((item) => (
            <Item item={item} linkPart="merch" key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function UpdateMerch() {
  const [merch, setMerch] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/merch/${id}`) // Use the id from the URL
      .then((response) => {
        setMerch(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!merch) {
    // If there is no data, return a loading indicator
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }
  console.log(merch);
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Uredi merch</h1>
        <MerchForm item={merch} />
      </div>
    </div>
  );
}

export function CreateMerch() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Dodaj merch</h1>
        <MerchForm />
      </div>
    </div>
  );
}

export function MerchOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/orders`) // Use the id from the URL
      .then((response) => {
        console.log(response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!orders) {
    // If there is no data, return a loading indicator
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  const headers = ["Cena", "Datum"];

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Merch Orders</h1>
        {/* <div className="padding-tb">
          <LinkButton link="/merch/orders/create" text="Order Merch" />
        </div> */}
        <UsefulTable
          headers={headers}
          rows={orders}
          buttonLink="/merch/orders/create"
          buttonText="Naroci"
          linkIndex={2}
          linkPart="merch/orders"
        />
      </div>
    </div>
  );
}

export function OrderMerch() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Vnesi naročilo</h1>
        <OrdersForm />
      </div>
    </div>
  );
}

export function UpdateOrder() {
  const [orderData, setOrderData] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/orders/${id}`)
      .then((response) => {
        setOrderData(response.data);
        console.log(orderData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!orderData) {
    // If there is no data, return a loading indicator
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Edit order</h1>
        <OrdersForm order={orderData} />
      </div>
    </div>
  );
}

export function CreateSale() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Prodaj merch</h1>
        <SalesForm />
      </div>
    </div>
  );
}

export function UpdateSale() {
  const [sale, setSale] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/sales/${id}`)
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
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Prodaj merch</h1>
        <SalesForm sale={sale} />
      </div>
    </div>
  );
}

export function MerchSales() {
  const headers = ["Datum", "Zasluzek", ""];
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/sales`) // Use the id from the URL
      .then((response) => {
        console.log(response.data);
        setSales(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="background padding-3">
      <UsefulTable
        headers={headers}
        rows={sales}
        title="Prodaja mercha"
        buttonText="Zabelezi prodajo"
        buttonLink="create"
        linkIndex={2}
        linkPart="merch/sales"
      />
    </div>
  );
}
