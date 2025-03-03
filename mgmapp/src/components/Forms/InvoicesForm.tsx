import InputSelect from "../Inputs/Formik/FormikSelect";
import Input from "../Inputs/Formik/FormikInput";
import InputCheckbox from "../Inputs/Formik/FormikCheckbox";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getDate } from "../misc";
import SubmButton from "../ui/SubmButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface Entity {
  id: string;
  name: string;
}

interface Props {
  entities: Entity[];
}

const InvoicesForm = ({ entities }: Props) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const formik = useFormik({
    initialValues: {
      serviceName: "",
      amount: 0,
      status: 1,
      issue_date: getDate(),
      entity_id: "",
      type: 0,
    },
    validationSchema: Yup.object({
      serviceName: Yup.string().required("Naziv storitve"),
      amount: Yup.number().required("Cena"),
      entity_id: Yup.number().required("Prosimo izberite entiteto"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axiosPrivate.post("invoices", values);
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
      <InputSelect
        name="entity_id"
        variable="entity_id"
        label="Entiteta"
        classes="width-100"
        values={entities}
        withDisabled={true}
        formik={formik}
      />

      <div className="flex gap">
        <div className="width-100">
          <Input
            name="serviceName"
            variable="serviceName"
            label="Naziv storitve"
            formik={formik}
          />
        </div>

        <Input
          name="amount"
          variable="amount"
          label="Cena (&euro;)"
          type="number"
          classes="w60"
          step="0.01"
          formik={formik}
        />
      </div>

      <div className="flex justify-end margin-tb2">
        <InputCheckbox
          name="type"
          variable="type"
          label="Spletni račun"
          formik={formik}
        />
      </div>

      <SubmButton text="Ustvari" margin="2" />
    </form>
  );
};

export default InvoicesForm;
