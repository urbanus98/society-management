interface Props {
  name: string;
  label: string;
  variable: any;
  type?: string;
  classes?: string;
  formik: any;
}

const Input = ({
  name,
  label,
  variable,
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
            ? "text-red"
            : "bright-text"
        }`}
      >
        {label}
      </label>

      <input
        className={"input " + classes}
        type={type}
        name={name}
        value={formik.values[variable]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    </div>
  );
};

export default Input;
