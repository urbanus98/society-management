import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { statuses } from "../misc";
import * as Yup from "yup";
import SubmButton from "../ui/SubmButton";
import Input from "../Inputs/Formik/FormikInput";
import InputSelect from "../Inputs/Formik/FormikSelect";
import InputCheckbox from "../Inputs/Formik/FormikCheckbox";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { generateInvoicePDF } from "../../functions/generateInvoicePDF";

interface Props {
  entities: any[];
  invoice: any;
}

const InvoicesForm = ({ entities, invoice }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      id: invoice.id,
      serviceName: invoice.service,
      amount: invoice.amount,
      entity_id: invoice.payer_id,
      status: invoice.status,
      number: invoice.number,
      type: invoice.type,
      issueDate: invoice.issue_date,
    },
    validationSchema: Yup.object({
      serviceName: Yup.string().required("Naziv storitve"),
      amount: Yup.number().required("Cena"),
      entity_id: Yup.number().required("Prosimo izberite entiteto"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axiosPrivate.put(`invoices/${id}`, values);
        resetForm();
        navigate("/invoices");
      } catch (error) {
        console.error("Error updating form data:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePdfCreation = async () => {
    try {
      const issuingEntityRes = await axiosPrivate.get(`entities/1`);
      const payingEntityRes = await axiosPrivate.get(
        `entities/${invoice.payer_id}`
      );
      const issuer = issuingEntityRes.data;
      const payer = payingEntityRes.data;
      console.log("Issuer:", issuer);
      console.log("Payer:", payer);
      generateInvoicePDF(invoice, issuer[0], payer[0]); // Call the function directly
    } catch (error) {
      console.error("Error fetching entities:", error);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <InputSelect
        name="entity_id"
        label="Entiteta"
        classes="width-100"
        values={entities}
        withDisabled={false}
        formik={formik}
      />
      <div className="flex gap">
        <div className="width-100">
          <Input name="serviceName" label="Naziv storitve" formik={formik} />
        </div>

        <Input
          name="amount"
          label="Cena (&euro;)"
          type="number"
          classes="w70"
          step="0.01"
          formik={formik}
        />
      </div>

      <div className="flex gap">
        <div>
          <Input
            name="number"
            label="Zap. št."
            type="number"
            classes="w60"
            formik={formik}
          />
        </div>
        <div className="width-100">
          <Input
            name="issueDate"
            type="date"
            label="Datum izdaje računa"
            formik={formik}
          />
        </div>
        <div>
          <InputSelect
            name="status"
            values={statuses}
            label="Status:"
            withDisabled={false}
            formik={formik}
          />
        </div>
      </div>

      <div className="flex justify-between align-center margin-tb2">
        <label
          className="input_label bright-text pointer"
          style={{ margin: 0 }}
          onClick={handlePdfCreation}
        >
          Natisni račun
        </label>

        <InputCheckbox name="type" label="Spletni račun" formik={formik} />
      </div>

      <SubmButton text="Posodobi" margin="2" />
    </form>
  );
};

export default InvoicesForm;
