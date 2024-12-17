import React from "react";
import { Link } from "react-router-dom";

interface Props {
  item: any;
  linkPart: string;
}

const Item = ({ item, linkPart }: Props) => {
  return (
    <div className="coluflex white post">
      <img
        {...(item.image_path
          ? { src: `http://localhost:8081/${item.image_path}` }
          : { src: `http://localhost:8081/assets/tt_black.png` })}
        alt={item.name}
        className="border-radius width-100 margin-5"
      />
      <h4 className="margin-none">
        <Link
          className="no-decor dark-text"
          to={`/${linkPart}/${item.id}/edit`}
        >
          {item.name}
        </Link>
      </h4>
      {/* {item.types.map(({ type, price }: { type: string; price: number }) => (
        <div key={type}>
          <p className="margin-none">
            {type}: {price} &euro;
          </p>
        </div>
      ))} */}

      {item.types.map((type: any, index: number) => (
        <p className="margin-none" key={index}>
          <b>{type.type}</b>: {type.price} &euro;
        </p>
      ))}
    </div>
  );
};

export default Item;
