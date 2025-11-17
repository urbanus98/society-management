import FormikSelect from "../Inputs/Formik/FormikSelect";
import Input from "../Inputs/Formik/FormikInput";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getDate } from "../misc";
import SubmButton from "../ui/SubmButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

const ProForm = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
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
      serviceName: "",
      amount: 0,
      issueDate: getDate(),
      serviceDate: getDate(),
      entityId: "",
    },
    validationSchema: Yup.object({
      serviceName: Yup.string().required("Naziv storitve"),
      amount: Yup.number().required("Cena"),
      entityId: Yup.number().required("Prosimo izberite entiteto"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axiosPrivate.post("/api/proforma", values);
        resetForm();
        navigate("/finance");
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
        <div style={{ width: "60%" }}>
          <FormikSelect
            name="entityId"
            label="Entiteta"
            classes="input width-100"
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

      <div className="flex gap mar-btm30">
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
      <SubmButton text="Ustvari" margin="2" />
    </form>
  );
};

export default ProForm;
