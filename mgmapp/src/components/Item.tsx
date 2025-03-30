import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  item: any;
  linkPart: string;
}

const Item = ({ item, linkPart }: Props) => {
  const groupedTypes = item.types.reduce(
    (acc: Record<number, string[]>, type: any) => {
      if (!acc[type.price]) {
        acc[type.price] = [];
      }
      acc[type.price].push(type.type);
      return acc;
    },
    {}
  );

  return (
    <div className="coluflex justify-between white post">
      <img
        {...(item.image_path
          ? { src: `${API_URL}/${item.image_path}` }
          : { src: `${API_URL}/assets/tt_black.png` })}
        alt={item.name}
        className="border-radius width-100 margin-5"
      />
      <div>
        <h4>
          <Link
            className="no-decor dark-text"
            to={`/${linkPart}/${item.id}/edit`}
          >
            {item.name}
          </Link>
        </h4>
        {Object.entries(groupedTypes).map(([price, name], index) => (
          <p className="margin-none" key={index}>
            <b>{(name as string[]).join(", ")}</b>: {price} &euro;
          </p>
        ))}
      </div>
    </div>
  );
};

export default Item;
