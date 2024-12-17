interface Props {
  values: any[];
  defaultvalue: string;
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
      //   defaultValue={defaultvalue}
      value={defaultvalue}
      onClick={onClick}
      onChange={onChange}
      name={name}
    >
      {withDisabled && (
        <option value="" disabled>
          {" "}
          -- Izberi nekaj --{" "}
        </option>
      )}
      {withEnabled && <option value=""> -- Brez vrednosti -- </option>}

      {values.map((value) => (
        <option key={value.id} value={value.id}>
          {value.name}
        </option>
      ))}
    </select>
  );
};

export default Select;
