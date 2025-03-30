import Input from "../Inputs/Formik/FormikInput";
import FormikSelect from "../Inputs/Formik/FormikSelect";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getDate } from "../misc";
import SubmButton from "../ui/SubmButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface Props {
  traffic?: any;
}

const TrafficUpdateForm = ({ traffic }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: traffic?.name || "",
      amount: traffic?.amount || 0,
      date: traffic?.date || getDate(),
      direction: traffic?.direction !== undefined ? traffic.direction : 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Naziv"),
      amount: Yup.number().required("Znesek"),
      date: Yup.date().required("Datum"),
      direction: Yup.number().required("Vrsta"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log(values);
      try {
        await axiosPrivate.put(`traffic/${id}`, values);

        resetForm();
        navigate("/traffic");
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
            name="name"
            label="Namen"
            placeholder="Npr. nakup opreme"
            classes="width-100"
            formik={formik}
          />
        </div>
        <div>
          <Input
            name="amount"
            label="Znesek (€)"
            type="number"
            classes="w70"
            formik={formik}
          />
        </div>
      </div>
      <div className="flex gap">
        <div className="width-50">
          <Input name="date" type="date" label="Datum" formik={formik} />
        </div>
        <div className="width-50">
          <FormikSelect
            name="direction"
            label="Vrsta"
            values={[
              { id: 0, name: "Priliv" },
              { id: 1, name: "Odliv" },
            ]}
            withDisabled={false}
            classes="width-100"
            formik={formik}
          />
        </div>
      </div>

      <SubmButton text="Potrdi" />
    </form>
  );
};

export default TrafficUpdateForm;
