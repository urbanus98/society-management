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
        // src={`http://localhost:8081/${item.image_path}`}
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
      <p className="margin-none">{item.price} &euro;</p>
    </div>
  );
};

export default Item;
