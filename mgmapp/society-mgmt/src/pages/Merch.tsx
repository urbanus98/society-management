import LinkButton from "../components/ui/LinkButton";
import MerchForm from "../components/Forms/MerchForm";
import { useEffect, useState } from "react";
import axios from "axios";
import Item from "../components/Item";
import { useParams } from "react-router-dom";

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

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-3">
        <h1 className="text-center bright-text">Merch</h1>
        <div className="flex justify-between">
          <LinkButton link="/merch/create" text="Create Merch" />
          <LinkButton link="/merch/sell" text="Sell Merch" />
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
  const [merch, setMerch] = useState<any[]>([]);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/merch/${id}`) // Use the id from the URL
      .then((response) => {
        setMerch(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

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

export function SellMerch() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Create sale</h1>
        <MerchForm />
      </div>
    </div>
  );
}
