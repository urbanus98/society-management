import Select from "../../ui/Select";

interface Props {
  name: string;
  label: string;
  variable: any;
  values: any;
  withDisabled?: boolean;
  withEnabled?: boolean;
  // defaultvalue?: string;
  classes?: string;
  formik: any;
}

const Input = ({
  name,
  label,
  variable,
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
          formik.touched[variable] && formik.errors[variable]
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
        defaultvalue={String(formik.values[variable])}
        onChange={formik.handleChange}
        name={name}
      />
    </>
  );
};

export default Input;
