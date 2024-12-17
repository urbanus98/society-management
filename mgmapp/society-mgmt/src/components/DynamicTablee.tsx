import React, { useState } from "react";

interface Row {
  type: string;
  price: string;
}

interface Props {
  children: any;
  item?: any;
}

const DynamicTablee = ({ item, children }: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [rows, setRows] = useState<Row[]>(
    item?.details || [{ type: "", price: "" }]
  );

  const handleRowChange = (index: number, field: keyof Row, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value; // TypeScript knows 'field' is a key of Row
    setRows(updatedRows);
  };

  const handleAddRow = (typeName?: string, typePrice?: any) => {
    setRows([
      ...rows,
      {
        type: typeof typeName === "string" ? typeName : "",
        price: typePrice !== undefined ? typePrice : "",
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <table style={{ borderSpacing: "0px" }}>
      <tbody>
        <tr>
          <th>
            <label className="input_label bright-text">Tip</label>
          </th>
          <th>
            <label className="input_label bright-text">Cena</label>
          </th>
        </tr>

        {rows.map((row, index) => (
          <div key={index}>{children}</div>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTablee;
