import Users from "./Users";
import LinkButton from "../ui/LinkButton";

const AdminPanel = () => {
  return (
    <section>
      <h1 className="bright-text">AdminPanel</h1>
      <LinkButton link="/register" text="Dodaj uporabnika" />
      <Users />
    </section>
  );
};

export default AdminPanel;
