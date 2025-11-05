import React from "react";
import FuncButton from "./FuncButton";

interface Column<T> {
  header: string;
  shortHeader?: string;
  key: keyof T;
  placeholder?: string;
  values?: { id: string | number; name: string }[];
  type?: string;
  step?: string;
  required?: boolean;
  classes?: string;
  disabled?: boolean;
  disabledOption?: boolean;
  onChange?: (rowIndex: number, selectedValue: string) => void;
}

interface DynamicTableProps<T> {
  rows: T[];
  setRows: React.Dispatch<React.SetStateAction<T[]>>;
  columns: Column<T>[];
  isDisabled?: boolean;
}

const DynamicTable = <T extends Record<string, any>>({
  rows,
  setRows,
  columns,
  isDisabled = false,
}: DynamicTableProps<T>) => {
  const handleRowChange = (
    index: number,
    field: keyof T,
    value: string | number | boolean
  ) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value as any;
    setRows(updatedRows);

    // Call onChange if it exists for this column
    const column = columns.find((col) => col.key === field);
    if (column?.onChange && typeof value === "string") {
      column.onChange(index, value);
    }
  };

  const handleAddRow = () => {
    const newRow = {} as T;
    columns.forEach((col) => (newRow[col.key] = "" as any)); // Initialize with empty values
    setRows([...rows, newRow]);
    // handleRowChange(rows.length - 1, columns[0].key, columns[0].values![0]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <table className="dynamic-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key.toString()} className={`th-${String(col.key)}`}>
              <label className="input_label bright-text" style={{ margin: 3 }}>
                <span className="header-long">{col.header}</span>
                {col.shortHeader ? (
                  <span className="header-short">{col.shortHeader}</span>
                ) : (
                  <span className="header-short">{col.header}</span>
                )}
              </label>
            </th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td
                key={col.key.toString()}
                className={`td-${String(col.key)} ${col.classes ?? ""}`}
              >
                {(() => {
                  switch (col.type) {
                    case "select":
                      return (
                        <select
                          className={
                            "input " +
                            (col.classes ? `${col.classes}` : "width-100")
                          }
                          value={row[col.key] || ""}
                          onChange={(e) => {
                            handleRowChange(index, col.key, e.target.value);
                          }}
                          required={col.required}
                          disabled={col.disabled}
                        >
                          <option disabled={col.disabledOption} value="">
                            Izberi iz seznama
                          </option>
                          {col.values?.map((value: any) => (
                            <option key={value.id} value={value.id}>
                              {value.name}
                            </option>
                          ))}
                        </select>
                      );
                    case "checkbox":
                      return (
                        <input
                          className={"input " + (col.classes ?? "")}
                          type="checkbox"
                          checked={Boolean(row[col.key])}
                          onChange={(e) =>
                            handleRowChange(index, col.key, e.target.checked)
                          }
                        />
                      );
                    case "number":
                      return (
                        <input
                          className={
                            "input " + (col.classes ? col.classes : "width-100")
                          }
                          type="number"
                          placeholder={col.placeholder || ""}
                          value={row[col.key] ?? ""}
                          step={col.step ?? "1"}
                          onChange={(e) =>
                            handleRowChange(index, col.key, e.target.value)
                          }
                          required={col.required}
                        />
                      );
                    default:
                      return (
                        <input
                          className={
                            "input " +
                            (col.classes ? col.classes : " width-100")
                          }
                          type={col.type || "text"}
                          placeholder={col.placeholder || ""}
                          value={row[col.key] ?? ""}
                          onChange={(e) =>
                            handleRowChange(index, col.key, e.target.value)
                          }
                          required={col.required}
                        />
                      );
                  }
                })()}
              </td>
            ))}
            <td>
              {index > 0 ? (
                <FuncButton
                  color="danger"
                  isDisabled={isDisabled}
                  onClick={() => handleRemoveRow(index)}
                >
                  <img src="/images/minus_s.png" alt="remove" width={20} />
                </FuncButton>
              ) : (
                <FuncButton onClick={handleAddRow} color="secondary">
                  <img
                    src="/images/plus_s.png"
                    alt="add"
                    width={20}
                    height={20}
                  />
                </FuncButton>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;
