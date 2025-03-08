interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  step?: string;
  classes?: string;
  formik: any;
}

const FormikInput = ({
  name,
  label,
  placeholder,
  type = "text",
  classes,
  step,
  formik,
}: Props) => {
  return (
    <div className="coluflex">
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

      <input
        className={"input " + classes}
        type={type}
        name={name}
        {...(placeholder && { placeholder: placeholder })}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        step={step}
      />
    </div>
  );
};

export default FormikInput;
