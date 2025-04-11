import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import InputSelect from "../Inputs/InputSelect";

interface Props {
  event: any;
  setMsg?: any;
  setAlertVisibility?: any;
  setAlertColor?: any;
}

const EventInvoiceForm = ({
  event,
  setMsg,
  setAlertVisibility,
  setAlertColor,
}: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const [invoiceIds, setInvoiceIds] = useState<any[]>([]);
  const [saleIds, setSaleIds] = useState<any[]>([]);

  const [invoiceId, setInvoiceId] = useState(event.invoice_id);
  const [saleId, setSaleId] = useState(event.sale_id);

  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [saleVisible, setSaleVisible] = useState(false);

  const applyInvoiceChange = async (value: any) => {
    try {
      const response = await axiosPrivate.put(`/events/${id}/invoice`, {
        invoiceId: value,
      });
      setInvoiceId(value);
      setMsg(response.data.message);
      setAlertVisibility(true);
      setAlertColor("success");
    } catch (error) {
      console.log(error);
      setAlertColor("danger");
      setMsg("Napaka pri dodeljevanju računa!");
    }
    setAlertVisibility(true);
  };

  const applySaleChange = async (value: any) => {
    try {
      const response = await axiosPrivate.put(`/events/${id}/sale`, {
        saleId: value,
      });
      setSaleId(value);
      setMsg(response.data.message);
      setAlertColor("success");
    } catch (error) {
      console.log(error);
      setAlertColor("danger");
      setMsg("Napaka pri dodeljevanju prodaje!");
    }
    setAlertVisibility(true);
  };

  useEffect(() => {
    const fetchEventIds = axiosPrivate.get(
      "/events/ids/" + (id != undefined ? id : -1)
    );
    console.log(id);

    fetchEventIds
      .then((idsResponse) => {
        setInvoiceIds(idsResponse.data.invoices);
        setSaleIds(idsResponse.data.sales);
        event.invoice_id && setInvoiceVisible(true);
        event.sale_id && setSaleVisible(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [axiosPrivate]);

  return (
    <div>
      <h4
        className="bright-text margin-tb1 pointer"
        onClick={() => setInvoiceVisible(!invoiceVisible)}
      >
        Račun
      </h4>

      {invoiceVisible && (
        <div className="width-100">
          <InputSelect
            name="eInvoiceId"
            values={invoiceIds}
            defaultvalue={invoiceId}
            classes="width-100"
            withEnabled={true}
            withDisabled={false}
            onChange={(e) => applyInvoiceChange(e.target.value)}
          />
        </div>
      )}
      <h4
        className="bright-text margin-tb1 pointer"
        onClick={() => setSaleVisible(!saleVisible)}
      >
        Prodaja
      </h4>
      {saleVisible && (
        <div className="width-100">
          <InputSelect
            name="eSaleId"
            values={saleIds}
            defaultvalue={saleId}
            classes="width-100"
            withEnabled={true}
            withDisabled={false}
            onChange={(e) => applySaleChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default EventInvoiceForm;
