import InputSelect from "../components/InputSelect";
import Input from "../components/Input";
import InputCheckbox from "../components/InputCheckbox";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

interface Entity {
  id: string;
  name: string;
}

interface Props {
  entities: Entity[];
}

const InvoicesForm = ({ entities }: Props) => {
  const navigate = useNavigate();

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
        console.log(values);
        // Send form data to API (replace with your API endpoint)
        const response = await fetch("http://localhost:8081/invoices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          // Data submitted successfully
          console.log("Form data submitted successfully:", values);

          // Reset form fields
          resetForm();

          // Redirect to /invoices route
          navigate("/invoices");
        } else {
          throw new Error("Failed to submit form data");
        }
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

      <div className="justify-center flex">
        <button type="submit" className="btn btn-primary width-50 margin-tb2 ">
          Dodaj
        </button>
      </div>
    </form>
  );
};

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

export default InvoicesForm;
