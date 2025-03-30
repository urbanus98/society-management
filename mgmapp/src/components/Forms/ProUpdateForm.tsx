import FormikSelect from "../Inputs/Formik/FormikSelect";
import Input from "../Inputs/Formik/FormikInput";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import SubmButton from "../ui/SubmButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { generatePDF } from "../../functions/generatePDF";

interface Props {
  proforma: any;
}

const ProUpdateForm = ({ proforma }: Props) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [entities, setEntities] = useState<any[]>([]);

  console.log(proforma);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await axiosPrivate.get("entities");
        setEntities(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntities();
  }, [axiosPrivate]);

  const formik = useFormik({
    initialValues: {
      serviceName: proforma.name,
      amount: proforma.amount,
      issueDate: proforma.issueDate,
      serviceDate: proforma.serviceDate,
      entityId: proforma.payerId,
      number: proforma.number,
    },
    validationSchema: Yup.object({
      serviceName: Yup.string().required("Naziv storitve"),
      amount: Yup.number().required("Cena"),
      entityId: Yup.number().required("Prosimo izberite entiteto"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axiosPrivate.put(`proforma/${proforma.id}`, values);
        resetForm();
        navigate("/finance");
      } catch (error) {
        console.error("Error submitting form data:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePdfCreation = async () => {
    try {
      const issuingEntityRes = await axiosPrivate.get(`entities/1`);
      const payingEntityRes = await axiosPrivate.get(
        `entities/${proforma.payerId}`
      );
      const issuer = issuingEntityRes.data;
      const payer = payingEntityRes.data;
      console.log("Issuer:", issuer);
      console.log("Payer:", payer);
      generatePDF(proforma, issuer, payer, "proforma");
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
            classes="width-100"
            values={entities}
            withDisabled={false}
            formik={formik}
          />
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
      <div className="width-100">
        <Input name="serviceName" label="Naziv storitve" formik={formik} />
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
            label="Datum izdaje ponudbe"
            formik={formik}
          />
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

      <div className="flex align-center margin-tb2">
        <label
          className="input_label bright-text pointer"
          style={{ margin: 0 }}
          onClick={handlePdfCreation}
        >
          Natisni ponudbo
        </label>
      </div>

      <SubmButton text="Posodobi" margin="2" />
    </form>
  );
};

export default ProUpdateForm;
