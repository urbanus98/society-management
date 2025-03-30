import Select from "../ui/Select";

interface Props {
  name: string;
  label?: string;
  values: any;
  withDisabled?: boolean;
  withEnabled?: boolean;
  defaultvalue?: string | number;
  classes?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const InputSelect = ({
  name,
  label,
  values,
  defaultvalue,
  withDisabled = true,
  withEnabled = false,
  classes,
  onChange,
}: Props) => {
  return (
    <>
      {label && (
        <label htmlFor={name} className={`input_label bright-text`}>
          {label}
        </label>
      )}

      <Select
        name={name}
        values={values}
        classes={classes}
        defaultvalue={defaultvalue || ""}
        withDisabled={withDisabled}
        withEnabled={withEnabled}
        onChange={onChange}
      />
    </>
  );
};

export default InputSelect;
