import Select from "./ui/Select";

interface Props {
  name: string;
  label: string;
  variable: any;
  values: any;
  withDisabled?: boolean;
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
            ? "text-red"
            : "bright-text"
        }`}
      >
        {label}
      </label>

      <Select
        values={values}
        classes={classes}
        withDisabled={withDisabled}
        defaultvalue={String(formik.values[variable])}
        onChange={formik.handleChange}
        name={name}
      />
    </>
  );
};

export default Input;
