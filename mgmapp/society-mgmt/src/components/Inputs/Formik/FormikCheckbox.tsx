interface Props {
  name: string;
  label: string;
  variable: any;
  classes?: string;
  formik: any;
}

const InputCheckbox = ({ name, label, variable, classes, formik }: Props) => {
  return (
    <div className="flex align-center">
      <label htmlFor={name} className="input_label bright-text">
        {label}
      </label>

      <input
        className={"input bigcheck " + classes}
        type="checkbox"
        name={name}
        checked={formik.values[variable] === 1}
        onChange={(e) => {
          formik.setFieldValue(variable, e.target.checked ? 1 : 0);
        }}
      />
    </div>
  );
};

export default InputCheckbox;
