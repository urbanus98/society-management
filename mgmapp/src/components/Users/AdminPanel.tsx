import Users from "./Users";
import LinkButton from "../ui/LinkButton";

const AdminPanel = () => {
  return (
    <section>
      <h1 className="bright-text">AdminPanel</h1>
      <div className="margin-tb1">
        <Users />
      </div>
      <LinkButton link="/register" text="Dodaj uporabnika" />
    </section>
  );
};

export default AdminPanel;
