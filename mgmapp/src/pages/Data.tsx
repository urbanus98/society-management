import { useState } from "react";
import LocationsForm from "../components/Forms/LocationsForm";
import MileageRatesForm from "../components/Forms/MileageRatesForm";
import Alert from "../components/ui/Alert";
import BackWTitle from "../components/BackWTitle";
import SocietyInfoForm from "../components/Forms/SocietyInfoForm";

export const DataManagement = () => {
  const [alertVisible, setAlertVisibility] = useState(false);
  const [msg, setMsg] = useState("");
  const [alertColor, setAlertColor] = useState<any>("success");

  return (
    <div className="padding-3 coluflex align-center">
      <BackWTitle title="Upravljanje podatkov" />
      <div className="margin-tb2 res-width-60">
        {alertVisible && (
          <Alert color={alertColor} onClose={() => setAlertVisibility(false)}>
            {msg}
          </Alert>
        )}
      </div>
      <div className="flex wrap justify-between res-width-60">
        <div
          className="coluflex margin-auto-lr"
          style={{ marginBottom: "2rem" }}
        >
          <h2 className="bright-text text-center">Lokacije</h2>
          <LocationsForm
            setMsg={setMsg}
            setAlertVisibility={setAlertVisibility}
            setAlertColor={setAlertColor}
          />
        </div>
        <div
          className="coluflex margin-auto-lr"
          style={{ marginBottom: "2rem" }}
        >
          <h2 className="bright-text text-center">Kilometrine</h2>
          <MileageRatesForm
            setMsg={setMsg}
            setAlertVisibility={setAlertVisibility}
            setAlertColor={setAlertColor}
          />
        </div>
      </div>
      <div>
        <h2 className="bright-text text-center">Društveni podatki</h2>
        <SocietyInfoForm
          setMsg={setMsg}
          setAlertVisibility={setAlertVisibility}
          setAlertColor={setAlertColor}
        />
      </div>
    </div>
  );
};
