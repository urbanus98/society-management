interface Props {
  name: string;
  label: string;
  value?: any;
  placeholder?: string;
  type?: string;
  classes?: string;
  required?: boolean;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  name,
  label,
  value,
  placeholder,
  type = "text",
  classes,
  required = false,
  handleChange,
}: Props) => {
  return (
    <div className="coluflex">
      <label htmlFor={name} className="input_label bright-text">
        {label}
      </label>

      <input
        className={"input " + classes}
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
};

export default Input;
