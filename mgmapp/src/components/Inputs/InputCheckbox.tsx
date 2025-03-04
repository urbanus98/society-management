interface Props {
  name: string;
  label: string;
  variable: boolean;
  classes?: string;
  onChange: (value: boolean) => void; // Ensure this receives the new state
}

const InputCheckbox = ({ name, label, variable, classes, onChange }: Props) => {
  return (
    <div className="flex align-center justify-end" style={{ padding: "0 5pt" }}>
      <label htmlFor={name} className="input_label bright-text">
        {label}
      </label>
      <input
        type="checkbox"
        name={name}
        id={name} // Match label htmlFor
        className={"bigcheck " + (classes || "")}
        checked={variable}
        onChange={(e) => onChange(e.target.checked)} // Pass new state
      />
    </div>
  );
};

export default InputCheckbox;
