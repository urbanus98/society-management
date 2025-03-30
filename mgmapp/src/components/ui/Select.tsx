interface Props {
  values: any[];
  defaultvalue: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClick?: () => void;
  name?: string;
  classes?: string;
  withDisabled?: boolean;
  withEnabled?: boolean;
}

const Select = ({
  values,
  defaultvalue,
  onChange,
  onClick,
  name,
  classes = "",
  withDisabled = true,
  withEnabled = false,
}: Props) => {
  return (
    <select
      className={" " + classes}
      value={defaultvalue}
      onClick={onClick}
      onChange={onChange}
      name={name}
    >
      {withDisabled && (
        <option value="" key={"disabled-option"} disabled>
          {" "}
          -- Izberi nekaj --{" "}
        </option>
      )}
      {withEnabled && (
        <option value="" key={"enabled-option"}>
          {" "}
          -- Brez vrednosti --{" "}
        </option>
      )}

      {values.map((value) => (
        <option key={value.id} value={value.id}>
          {value.name}
        </option>
      ))}
    </select>
  );
};

export default Select;
