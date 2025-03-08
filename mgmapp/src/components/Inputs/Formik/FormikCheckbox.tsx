interface Props {
  label: string;
  name: any;
  classes?: string;
  formik: any;
}

const InputCheckbox = ({ name, label, classes, formik }: Props) => {
  return (
    <div className="flex align-center">
      <label htmlFor={name} className="input_label bright-text">
        {label}
      </label>

      <input
        className={"input bigcheck " + classes}
        type="checkbox"
        name={name}
        checked={formik.values[name] === 1}
        onChange={(e) => {
          formik.setFieldValue(name, e.target.checked ? 1 : 0);
        }}
      />
    </div>
  );
};

export default InputCheckbox;
