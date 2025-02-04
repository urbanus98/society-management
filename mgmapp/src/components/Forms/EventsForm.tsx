import Input from "../Inputs/Formik/FormikInput";
import InputSelect from "../Inputs/Formik/FormikSelect";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import SubmButton from "../ui/SubmButton";
import { getDate } from "../misc";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface Props {
  event?: any;
}
const EventsForm = ({ event }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const [evenTypes, setEvenTypes] = useState<any[]>([]);
  const [invoiceIds, setInvoiceIds] = useState<any[]>([]);
  const [saleIds, setSaleIds] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventTypes = axiosPrivate.get("events/types");
    const fetchEventIds = axiosPrivate.get(
      "events/ids/" + (id == undefined ? -1 : id)
    );

    axios
      .all([fetchEventTypes, fetchEventIds])
      .then(
        axios.spread((typesResponse, idsResponse) => {
          setEvenTypes(typesResponse.data);
          setInvoiceIds(idsResponse.data.invoices);
          setSaleIds(idsResponse.data.sales);
        })
      )
      .catch((error) => {
        console.error(error);
      });
  }, [axiosPrivate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: event?.date || getDate(),
      typeId: event?.type_id || 1,
      name: event?.name || "",
      duration: event?.duration || 0,
      eSaleId: event?.sale_id == null ? "" : event?.sale_id,
      eInvoiceId: event?.invoice_id == null ? "" : event?.invoice_id,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Obvezno polje"),
      duration: Yup.number().required("Obvezno polje"),
      typeId: Yup.number().required("Obvezno polje"),
      date: Yup.date().required("Obvezno polje"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (id) {
          await axiosPrivate.put(`events/${id}`, values);
        } else {
          await axiosPrivate.post("events", values);
        }
        resetForm();
        navigate("/events");
      } catch (error) {
        console.error("Error submitting form data:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex gap">
        <div className="width-100">
          <Input
            label="Ime"
            name="name"
            variable="name"
            placeholder="Prepoznaven naslov..."
            formik={formik}
          />
        </div>
        <div>
          <Input
            label="Trajanje (h)"
            name="duration"
            variable="duration"
            type="number"
            classes="w80"
            formik={formik}
          />
        </div>
      </div>

      <div className="flex gap">
        <div className="width-50">
          <InputSelect
            label="Tip dogodka"
            name="typeId"
            variable={"typeId"}
            values={evenTypes}
            withDisabled={false}
            classes="width-100"
            formik={formik}
          />
        </div>
        <div className="width-50">
          <Input
            label="Datum dogodka"
            name="date"
            variable="date"
            type="date"
            formik={formik}
          />
        </div>
      </div>

      <h3 className="bright-text" style={{ margin: "15pt 0 0 0" }}>
        Dodeli račun/prodajo
      </h3>
      <div className="width-100">
        <InputSelect
          label="Racun"
          name="eInvoiceId"
          variable={"eInvoiceId"}
          values={invoiceIds}
          classes="width-100"
          withEnabled={true}
          withDisabled={false}
          formik={formik}
        />
      </div>
      <div className="width-100">
        <InputSelect
          label="Prodaja"
          name="eSaleId"
          variable={"eSaleId"}
          values={saleIds}
          classes="width-100"
          withEnabled={true}
          withDisabled={false}
          formik={formik}
        />
      </div>

      <SubmButton />
    </form>
  );
};

export default EventsForm;
