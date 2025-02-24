import Input from "../Inputs/Formik/FormikInput";
import InputSelect from "../Inputs/Formik/FormikSelect";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getDate } from "../misc";
import SubmButton from "../ui/SubmButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

interface Props {
  flow?: any;
}

const FlowForm = ({ flow }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  // const { auth } = useAuth();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: flow?.name || "",
      amount: flow?.amount || 0,
      date: flow?.date || getDate(),
      direction: flow?.direction !== undefined ? flow.direction : 1,
      // userID: auth.id,
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
        if (id) {
          await axiosPrivate.put(`black/flow/${id}`, values);
        } else {
          await axiosPrivate.post("black/flow", values);
        }
        resetForm();
        navigate("/black");
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
            variable="name"
            label="Razlog"
            placeholder="Zakaj in kako"
            classes="width-100"
            formik={formik}
          />
        </div>
        <div>
          <Input
            name="amount"
            variable="amount"
            label="Znesek (€)"
            type="number"
            classes="w70"
            formik={formik}
          />
        </div>
      </div>
      <div className="flex gap">
        <div className="width-50">
          <Input
            name="date"
            variable="date"
            type="date"
            label="Datum"
            formik={formik}
          />
        </div>
        <div className="width-50">
          <InputSelect
            name="direction"
            variable="direction"
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

export default FlowForm;
