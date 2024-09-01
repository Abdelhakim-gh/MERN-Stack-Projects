import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import { useFinancialRecords } from "../../contexts/financialContext";
import { format } from "date-fns";
import "./financial.css";

/**
 * EditableCell Component:
 *
 * This component is used to render a cell in the table that can be
 * edited. It takes the following props:
 *
 * - value: The initial value of the cell
 * - row: The row data of the table
 * - column: The column data of the table
 * - updateRecord: A function to update the record in the table
 * - editable: A boolean indicating whether the cell is editable or not
 *
 * It returns a JSX element that is either a text node or an input
 * element depending on whether the cell is being edited or not.
 */
const EditableCell = ({ value: initialValue, row, column, updateRecord, editable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || ""); // Initialize with an empty string if value is undefined

  useEffect(() => {
    setValue(initialValue || ""); // Handle undefined initial value
  }, [initialValue]);

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          autoFocus
          style={{ width: "100px" }}
        />
      ) : (
        value || "N/A" // Display "N/A" if value is undefined or empty
      )}
    </div>
  );
};

/**
 * FinancialList Component:
 *
 * This component is used to render a table of financial records. It
 * takes no props and uses the useFinancialRecords hook to get the
 * financial records and the updateRecord and deleteRecord functions
 */
function FinancialList() {
  const { financialRecords: records, updateRecord, deleteRecord } = useFinancialRecords();

  // Debug: Check if records has data
  console.log("records data from context:", records);

  /**
   * updateCellRecord function:
   *
   * This function is used to update a record in the table when the
   * user edits a cell. It takes the row index, column id and new value
   * as arguments and calls the updateRecord function with the
   * updated record.
   */
  const updateCellRecord = (rowIndex, columnId, value) => {
    const id = records[rowIndex]?._id;
    if (id) {
      updateRecord(id, { ...records[rowIndex], [columnId]: value });
    }
  };

  /**
   * columns variable:
   *
   * This variable is an array of objects that define the columns of
   * the table. Each object has the following properties:
   *
   * - Header: The header text of the column
   * - accessor: The key of the record that is used to access the
   *   value of the cell
   * - Cell: A function that takes a props object and returns a JSX
   *   element that is used to render the cell
   */
  const columns = useMemo(() => [
    {
      Header: "Description",
      accessor: "description",
      Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />,
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />,
    },
    {
      Header: "Category",
      accessor: "category",
      Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />,
    },
    {
      Header: "Payment Method",
      accessor: "payementMethod", // Corrected accessor
      Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />,
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ value }) => format(new Date(value), 'MMM dd, yyyy HH:mm'),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <button onClick={() => deleteRecord(row.original._id)} className="button">
          Delete
        </button>
      ),
    },
  ], [records, updateRecord, deleteRecord]);

  const data = useMemo(() => {
    console.log("Processed records for table:", records); // Debug: check processed data
    return records;
  }, [records]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <>
      <div className="table-container">
        <p>Tap the fields & update them</p>
        <table {...getTableProps()}>
          <caption>Financial Records</caption>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No data available</td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td key={cell.column.id} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FinancialList;



