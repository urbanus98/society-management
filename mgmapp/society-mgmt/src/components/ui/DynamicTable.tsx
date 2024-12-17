import React from "react";
import FuncButton from "../ui/FuncButton";

interface Column<T> {
  header: string;
  key: keyof T; // Ensure the key corresponds to a property of the generic type
  placeholder?: string;
  values?: string[];
  // values?: { id: string | number; name: string }[];
  type?: string;
  // updateAColumn?: (index: number, field: keyof T, value: string) => void;
  onChange?: () => void;
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
  const handleRowChange = (index: number, field: keyof T, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value as any;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const newRow = {} as T;
    columns.forEach((col) => (newRow[col.key] = "" as any)); // Initialize with empty values
    setRows([...rows, newRow]);
    // handleRowChange(rows.length - 1, columns[0].key, columns[0].values![0]);
  };

  // const handleAddRow = () => {
  //   const newRow = {} as T;

  //   columns.forEach((col) => {
  //     if (col.type === "select" && col.values && col.values.length > 0) {
  //       // Set the default value to the first option's ID
  //       newRow[col.key] = col.values[0].id as any;
  //     } else if (col.type === "number") {
  //       // Initialize number fields with 0 or empty string
  //       newRow[col.key] = "" as any;
  //     } else {
  //       // Initialize other fields with an empty string
  //       newRow[col.key] = "" as any;
  //     }
  //   });

  //   setRows([...rows, newRow]);
  // };

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <table style={{ borderSpacing: "0px" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key.toString()}>
              <label className="input_label bright-text">{col.header}</label>
            </th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col.key.toString()} className="width-100">
                {col.type === "select" ? (
                  <select
                    className="input width-100 padding-5"
                    value={row[col.key] || ""}
                    onChange={(e) => {
                      handleRowChange(index, col.key, e.target.value);
                      if (col.onChange) {
                        col.onChange();
                      }
                    }}
                    required
                  >
                    <option disabled value="">
                      Izberi produkt
                    </option>
                    {col.values?.map((value: any) => (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={
                      "input" + (col.type == "number" ? " w60" : " width-100")
                    }
                    type={col.type || "text"}
                    placeholder={col.placeholder || ""}
                    value={row[col.key] || ""}
                    onChange={(e) =>
                      handleRowChange(index, col.key, e.target.value)
                    }
                    required
                  />
                )}
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
