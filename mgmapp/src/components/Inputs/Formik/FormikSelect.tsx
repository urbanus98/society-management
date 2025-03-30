import Select from "../../ui/Select";

interface Props {
  name: string;
  label: string;
  values: any;
  withDisabled?: boolean;
  withEnabled?: boolean;
  // defaultvalue?: string;
  classes?: string;
  formik: any;
}

const FormikSelect = ({
  name,
  label,
  values,
  withDisabled = true,
  withEnabled = false,
  classes,
  // defaultvalue,
  formik,
}: Props) => {
  return (
    <>
      <label
        htmlFor={name}
        className={`input_label ${
          formik.touched[name] && formik.errors[name]
            ? "red-text"
            : "bright-text"
        }`}
      >
        {label}
      </label>

      <Select
        values={values}
        classes={classes}
        withDisabled={withDisabled}
        withEnabled={withEnabled}
        defaultvalue={String(formik.values[name])}
        onChange={formik.handleChange}
        name={name}
      />
    </>
  );
};

export default FormikSelect;
