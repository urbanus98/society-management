import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { getDate, statuses } from "../misc";
import * as Yup from "yup";
import SubmButton from "../ui/SubmButton";
import Input from "../Inputs/Formik/FormikInput";
import FormikSelect from "../Inputs/Formik/FormikSelect";
import InputCheckbox from "../Inputs/Formik/FormikCheckbox";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { generatePDF } from "../../functions/generatePDF";
import { useEffect, useState } from "react";

interface Props {
  invoice: any;
}

const InvoicesForm = ({ invoice }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const [entities, setEntities] = useState<any[]>([]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await axiosPrivate.get("/api/entities");
        setEntities(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntities();
  }, [axiosPrivate]);

  const formik = useFormik({
    initialValues: {
      id: invoice.invoiceId,
      serviceName: invoice.name,
      amount: invoice.amount,
      entityId: invoice.payerId,
      status: invoice.status ?? 0,
      number: invoice.invoiceNumber,
      type: invoice.type ?? 0,
      issueDate: invoice.issueDate,
      serviceDate: invoice?.serviceDate ?? getDate(),
    },
    validationSchema: Yup.object({
      serviceName: Yup.string().required("Naziv storitve"),
      amount: Yup.number().required("Cena"),
      entityId: Yup.number().required("Prosimo izberite entiteto"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axiosPrivate.put(`/api/invoices/${id}`, values);
        resetForm();
        navigate("/finance");
      } catch (error) {
        console.error("Error updating form data:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePdfCreation = async () => {
    try {
      const issuingEntityRes = await axiosPrivate.get(`/api/entities/1`);
      const payingEntityRes = await axiosPrivate.get(
        `/api/entities/${invoice.payerId}`
      );
      const issuer = issuingEntityRes.data;
      const payer = payingEntityRes.data;
      console.log("Issuer:", issuer);
      console.log("Payer:", payer);
      generatePDF(invoice, issuer, payer, "invoice");
    } catch (error) {
      console.error("Error fetching entities:", error);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex gap">
        <div style={{ width: "60%" }}>
          <FormikSelect
            name="entityId"
            label="Entiteta"
            classes="input width-100"
            values={entities}
            withDisabled={false}
            formik={formik}
          />{" "}
        </div>
        <div style={{ width: "40%" }}>
          <Input
            name="serviceDate"
            type="date"
            label="Datum storitve"
            classes="width-100"
            formik={formik}
          />
        </div>
      </div>
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
            label="Datum izdaje"
            formik={formik}
          />
        </div>
        <div>
          <FormikSelect
            name="status"
            values={statuses}
            label="Status:"
            classes="input"
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

      <SubmButton margin="2" />
    </form>
  );
};

export default InvoicesForm;
