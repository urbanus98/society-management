import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import SubmButton from "../ui/SubmButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FormikInput from "../Inputs/Formik/FormikInput";

interface Props {
  entity?: any;
}

const EntitiesForm = ({ entity }: Props) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  console.log("Entity:", entity);

  const formik = useFormik({
    initialValues: {
      name: entity?.name || "",
      address: entity?.address || "",
      postal: entity?.postal || "",
      city: entity?.city || "",
      head: entity?.head || "",
      iban: entity?.iban || "",
      bank: entity?.bank || "",
      note: entity?.note || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Ime je obvezno polje"),
      address: Yup.string().required("Naslov je obvezno polje"),
      postal: Yup.number().required("Pošta je obvezno polje"),
      city: Yup.string().required("Kraj je obvezno polje"),
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
      <FormikInput
        label="Ime"
        name="name"
        placeholder="Ime/naziv društva"
        classes="input width-100"
        formik={formik}
      />
      <FormikInput
        label="Naslov"
        name="address"
        placeholder="Naslov društva"
        classes="input width-100"
        formik={formik}
      />
      <div className="flex gap">
        <div className="width-50">
          <FormikInput
            label="Pošta"
            name="postal"
            placeholder="Poštna številka"
            classes="input width-100"
            formik={formik}
          />
        </div>
        <div className="width-50">
          <FormikInput
            label="Kraj"
            name="city"
            placeholder="Kraj"
            classes="input width-100"
            formik={formik}
          />
        </div>
      </div>
      <FormikInput
        label="Predsednik"
        name="head"
        placeholder="Predsednik"
        classes="input width-100"
        formik={formik}
      />
      <div className="flex gap">
        <div className="width-100">
          <FormikInput
            label="TRR"
            name="iban"
            placeholder="TRR"
            classes="input"
            formik={formik}
          />
        </div>
        <FormikInput
          label="Banka"
          name="bank"
          placeholder="Banka društva"
          classes="input"
          formik={formik}
        />
      </div>
      <FormikInput
        label="Opombe"
        name="note"
        placeholder="So lopovi ipd..."
        classes="input width-100"
        formik={formik}
      />
      <SubmButton text="Dodaj" />
    </form>
  );
};

export default EntitiesForm;
