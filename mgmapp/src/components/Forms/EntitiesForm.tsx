import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import SubmButton from "../ui/SubmButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface Props {
  name?: string;
  address?: string;
  postal?: number;
  place?: string;
  iban?: string;
  note?: string;
  submitLink?: string;
}

const EntitiesForm = ({ name, address, postal, place, iban, note }: Props) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      name: name || "",
      address: address || "",
      postal: postal || "",
      place: place || "",
      iban: iban || "",
      note: note || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Ime je obvezno polje"),
      address: Yup.string().required("Naslov je obvezno polje"),
      postal: Yup.number().required("Pošta je obvezno polje"),
      place: Yup.string().required("Kraj je obvezno polje"),
      // iban: Yup.string().required("IBAN je obvezno polje"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (id) {
          await axiosPrivate.put(`entities/${id}`, values);
        } else {
          await axiosPrivate.post("entities", values);
        }
        resetForm();
        navigate("/invoices");
      } catch (error) {
        console.error("Error submitting form data:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label
        htmlFor="name"
        className={`input_label ${
          formik.touched.name && formik.errors.name ? "red-text" : "bright-text"
        }`}
      >
        {formik.touched.name && formik.errors.name ? formik.errors.name : "Ime"}
      </label>
      <input
        type="text"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Ime/naziv društva"
        className="input width-100"
      />
      <label
        htmlFor=""
        className={`input_label ${
          formik.touched.address && formik.errors.address
            ? "red-text"
            : "bright-text"
        }`}
      >
        {formik.touched.address && formik.errors.address
          ? formik.errors.address
          : "Naslov"}
      </label>
      <input
        type="text"
        name="address"
        value={formik.values.address}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Naslov društva"
        className="input width-100"
      />
      <label
        htmlFor=""
        className={`input_label ${
          formik.touched.postal && formik.errors.postal
            ? "red-text"
            : "bright-text"
        }`}
      >
        {formik.touched.postal && formik.errors.postal
          ? formik.errors.postal
          : "Pošta"}
      </label>
      <input
        type="number"
        name="postal"
        value={formik.values.postal}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Poštna številka"
        className="input width-100"
      />
      <label
        htmlFor=""
        className={`input_label ${
          formik.touched.place && formik.errors.place
            ? "red-text"
            : "bright-text"
        }`}
      >
        {formik.touched.place && formik.errors.place
          ? formik.errors.place
          : "Kraj"}
      </label>
      <input
        type="text"
        name="place"
        value={formik.values.place}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Kraj"
        className="input width-100"
      />
      <label
        htmlFor=""
        className={`input_label ${
          formik.touched.iban && formik.errors.iban ? "red-text" : "bright-text"
        }`}
      >
        {formik.touched.iban && formik.errors.iban ? formik.errors.iban : "TRR"}
      </label>
      <input
        type="text"
        name="iban"
        value={formik.values.iban}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="TRR"
        className="input width-100"
      />
      <label htmlFor="" className="input_label bright-text">
        {formik.touched.note && formik.errors.note
          ? formik.errors.note
          : "Opombe"}
      </label>
      <input
        type="text"
        name="note"
        value={formik.values.note}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="So lopovi ipd..."
        className="input width-100"
      />
      <SubmButton text="Dodaj" />
    </form>
  );
};

export default EntitiesForm;
