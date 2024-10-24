import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import ListGroup from "../components/ListGroup";
import { useState } from "react";

export const Home = () => {
  const [alertVisible, setAlertVisibility] = useState(false);
  let listItems = [
    "An item",
    "A second item",
    "A third item",
    "A fourth item",
    "And a fifth one",
  ];

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  return (
    <div>
      {alertVisible && (
        <Alert onClose={() => setAlertVisibility(false)}>Hellow</Alert>
      )}
      <ListGroup
        items={listItems}
        heading="List of items"
        onSelectItem={handleSelectItem}
      />
      <Button onClick={() => setAlertVisibility(true)}>Butt</Button>
    </div>
  );
};
