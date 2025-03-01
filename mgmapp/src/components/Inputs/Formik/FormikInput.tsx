interface Props {
  name: string;
  label: string;
  variable: any;
  placeholder?: string;
  type?: string;
  classes?: string;
  formik: any;
}

const FormikInput = ({
  name,
  label,
  variable,
  placeholder,
  type = "text",
  classes,
  formik,
}: Props) => {
  return (
    <div className="coluflex">
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

      <input
        className={"input " + classes}
        type={type}
        name={name}
        {...(placeholder && { placeholder: placeholder })}
        value={formik.values[variable]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    </div>
  );
};

export default FormikInput;
