import React, { useState } from 'react';
import { Table } from "@radix-ui/themes";
import { ThemeProvider, Theme, Button, Input, CheckboxField } from '@aws-amplify/ui-react';
import { useLocation } from "react-router-dom";
import { UpdateFormContent, PublishForm } from "../actions/form";

const theme: Theme = {
  name: 'table-theme',
  tokens: {
    components: {
      table: {
        row: {
          hover: {
            backgroundColor: { value: '{colors.blue.10}' }, // light blue hover
          },
          striped: {
            backgroundColor: { value: '{colors.blue.5}' }, // light striped rows
          },
        },
        header: {
          color: { value: '{colors.gray.80}' }, // darker text for header
          fontSize: { value: '{fontSizes.lg}' },
          fontWeight: { value: '{fontWeights.bold}' },
        },
        data: {
          fontWeight: { value: '{fontWeights.normal}' },
        },
      },
    },
  },
};

type TableData = string[][];

const generateColumnLetter = (index: number): string => {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
};

const columnLetterToIndex = (letter: string): number => {
  let index = 0;
  for (let i = 0; i < letter.length; i++) {
    index = index * 26 + (letter.charCodeAt(i) - 65 + 1);
  }
  return index - 1; // Convert to zero-based index
};

const FormBuilder: React.FC = () => {
  const location = useLocation();
  const formData = location.state?.form || {};
  const formID = location.state?.formID || location.state?.form?.ID || location.state;

  if (!formData) {
    return <div>No form data found.</div>;
  }

  const [tableData, setTableData] = useState<TableData>(() => {
    if (formData?.content) {
      try {
        const parsed = JSON.parse(formData.content);
        return Array.isArray(parsed) ? parsed : [['']];
      } catch (e) {
        console.error("Erro ao fazer parse do formData.content:", e);
        return [['']];
      }
    } else {
      // Se formData for undefined ou não contiver conteúdo, inicie com uma estrutura padrão
      return [['']];
    }
  });

  const [rowInput, setRowInput] = useState('');
  const [colInput, setColInput] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [dividers, setDividers] = useState<number[]>([]); // Track divider rows
  const [sections, setSections] = useState<string[]>([]); // Track section names
  const [readOnlyColumns, setReadOnlyColumns] = useState<string[]>([]);
  const [readOnlyRows, setReadOnlyRows] = useState<string[]>([]);

  const addRow = () => {
    setTableData([...tableData, Array(tableData[0].length).fill('')]);
  };

  const addColumn = () => {
    setTableData(tableData.map(row => [...row, '']));
  };

  const removeRow = (rowIndex: number) => {
    const newTableData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(newTableData);
  };

  const removeColumn = (colLetter: string) => {
    const colIndex = columnLetterToIndex(colLetter);
    const newTableData = tableData.map(row => row.filter((_, index) => index !== colIndex));
    setTableData(newTableData);
  };

  const handleRemoveRow = () => {
    const rowIndex = parseInt(rowInput) - 1; // Convert to zero-based index
    if (!isNaN(rowIndex) && rowIndex >= 0 && rowIndex < tableData.length) {
      removeRow(rowIndex);
    }
  };

  const handleRemoveColumn = () => {
    if (colInput) {
      const colIndex = columnLetterToIndex(colInput);
      if (colIndex >= 0 && colIndex < tableData[0].length) {
        removeColumn(colInput);
      }
    }
  };

  const addDivider = () => {
    const newDividers = [...dividers, tableData.length];
    setDividers(newDividers);

    // Add a new section with an optional name.
    const newSections = [...sections, sectionTitle || 'Untitled Section'];
    setSections(newSections);

    // Remove all the cells in the specific row and insert a title.
    const newTableData = [...tableData];
    const dividerRowIndex = newTableData.length - 1; // The last row
    newTableData[dividerRowIndex] = Array(newTableData[dividerRowIndex].length).fill(''); // Empty the row
    newTableData[dividerRowIndex][0] = sectionTitle || 'Untitled Section'; // Add section title in the first cell

    setTableData(newTableData);
  };

  const handleSectionTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionTitle(e.target.value);
  };
  // Gather the form data and structure it properly
  const gatherFormData = () => {
    const formData = tableData.map((row) => {
      return row.map((cell) => cell.trim());
    });

    return {
      table: formData,
      readOnlyColumns: readOnlyColumns,
      readOnlyRows: readOnlyRows,
      
    };
  };

  const handlePublish = async () => {
    try {

      if (!formID) {
        console.error("Form ID is missing");
        alert("Form ID is missing. Please ensure the form is created or selected.");
        return;
      }

      const formData = gatherFormData();
      const formDataString = JSON.stringify(formData); // Convert the data to JSON


      // Call the PublishForm function with the form ID and stringified form data
      const updatedForm = await PublishForm(formID, formDataString);

      console.log("Form published successfully:", updatedForm);
      // You can add any additional handling after the form update here
    } catch (error) {
      console.error("Error publishing form:", error);
    }
  };

  async function handleSave(): Promise<void> {
    try {

      if (!formID) {
        console.error("Form ID is missing");
        alert("Form ID is missing. Please ensure the form is created or selected.");
        return;
      }

      const formData = gatherFormData();
      const formDataString = JSON.stringify(formData); // Convert the data to JSON
      console.log("Saving form with ID:", formID); // Log the form ID being used

      // Call the UpdateFormContent function with the form ID and stringified form data
      const updatedForm = await UpdateFormContent(formID, formDataString);

      console.log("Form saved successfully:", updatedForm);
      // You can add any additional handling after the form save here
    } catch (error) {
      console.error("Error saving form:", error);
    }
  }


  const toggleReadOnly = (col: string) => {
    setReadOnlyColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };
  console.log("Rows:", readOnlyRows);
  const toggleReadOnlyRows = (rowKey: string) => {
    setReadOnlyRows((prev) =>
      prev.includes(rowKey)
        ? prev.filter((r) => r !== rowKey)
        : [...prev, rowKey]
    );
  };
  

  return (
    <ThemeProvider theme={theme} colorMode="light">
      <div className="form-builder">
        <div className="sidebar" style={{ padding: '10px', borderRight: '2px solid #ddd' }}>
          <div style={{ marginBottom: '10px' }}>
            <Button
              ariaLabel="Add Row"
              backgroundColor="#ffd811"
              borderRadius="1rem"
              color="black"
              fontWeight="normal"
              onClick={addRow}
              size="small"
              width="9rem"
            >
              Add Row
            </Button>

            <Button
              ariaLabel="Remove Row"
              backgroundColor="#ffd811"
              borderRadius="1rem"
              color="black"
              fontWeight="normal"
              onClick={handleRemoveRow}
              size="small"
              width="9rem"
            >
              Remove Row
            </Button>
            <Input
              size="small"
              width="9rem"
              type="number"
              borderColor={'black'}
              value={rowInput}
              onChange={(e) => setRowInput(e.target.value)}
              placeholder="Row number"
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <Button
              ariaLabel="Add Column"
              backgroundColor="#ffd811"
              borderRadius="1rem"
              color="black"
              fontWeight="normal"
              onClick={addColumn}
              size="small"
              width="9rem"
            >
              Add Column
            </Button>
            <Button
              ariaLabel="Remove Column"
              backgroundColor="#ffd811"
              borderRadius="1rem"
              color="black"
              fontWeight="normal"
              onClick={handleRemoveColumn}
              size="small"
              width="9rem"
            >
              Remove Column
            </Button>
            <Input
              size="small"
              width="9rem"
              borderColor={'black'}
              type="text"
              value={colInput}
              onChange={(e) => setColInput(e.target.value)}
              placeholder="Column letter"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <Button
              ariaLabel="Add Divider"
              backgroundColor="#ffd811"
              borderRadius="1rem"
              color="black"
              fontWeight="normal"
              onClick={addDivider}
              size="small"
              width="9rem"
            >
              Add Divider
            </Button>

            <Input
              size="small"
              width="9rem"
              borderColor={'black'}
              type="text"
              value={sectionTitle}
              onChange={handleSectionTitleChange}
              placeholder="Section Title"
              style={inputStyle}
            />
          </div>

          <Button
            ariaLabel="Publish"
            backgroundColor="#ffd811"
            borderRadius="1rem"
            color="black"
            fontWeight="normal"
            onClick={() => handlePublish()}
            size="small"
            width="9rem"
          >
            Publish
          </Button>
          <Button
            ariaLabel="Publish"
            backgroundColor="#ffd811"
            borderRadius="1rem"
            color="black"
            fontWeight="normal"
            onClick={() => handleSave()}
            size="small"
            width="9rem"
          >
            Save Form
          </Button>
        </div>

        <div className="table-container">
          <Table.Root aria-label="Form Table">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                {Array.from({ length: tableData[0].length }, (_, index) => {
                  const colLetter = generateColumnLetter(index);
                  return (
                    <Table.ColumnHeaderCell key={`checkbox-${index}`}>
                      <CheckboxField
                        label={`Column ${colLetter}`}
                        name={`column-${colLetter}`}
                        checked={readOnlyColumns.includes(colLetter)}
                        onChange={() => {
                          toggleReadOnly(colLetter);
                          console.log("Read-only column indexes:", colLetter);
                        }}
                        title={`Toggle read-only for column ${colLetter}`}
                        style={{ marginBottom: '4px' }}
                      />
                    </Table.ColumnHeaderCell>
                  );
                })}

              </Table.Row>
              <Table.Row>
                <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                {Array.from({ length: tableData[0].length }, (_, index) => (
                  <Table.ColumnHeaderCell key={`label-${index}`}>
                    {generateColumnLetter(index)}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {tableData.map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  <Table.RowHeaderCell>
                    <CheckboxField
                      label={`Row ${rowIndex + 1}`}
                      name={`row-${rowIndex +1 }`}
                      checked={readOnlyRows.includes(rowIndex.toString())}
                      onChange={() => {
                        toggleReadOnlyRows(rowIndex.toString())
                        console.log("Read-only column indexes:", rowIndex);
                      }}
                      title={`Toggle read-only for row ${rowIndex + 1}`}
                      style={{ marginRight: '4px' }}
                    />

                  </Table.RowHeaderCell>
                  {row.map((cell, colIndex) => (
                    <Table.Cell key={colIndex}>
                      <input
                        type="text"
                        value={cell}
                        style={inputCellStyle}
                        onChange={(e) => {
                          const updatedTableData = [...tableData];
                          const updatedRow = [...updatedTableData[rowIndex]]; // Copy the specific row
                          updatedRow[colIndex] = e.target.value; // Update the specific cell
                          updatedTableData[rowIndex] = updatedRow; // Assign updated row back
                          setTableData(updatedTableData); // Update state
                        }}
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    </ThemeProvider>
  );
};

// Styling
const buttonStyle = {
  padding: '8px 12px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '5px',
  fontSize: '14px',
};

const inputStyle = {
  padding: '5px',
  margin: '0 5px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
};

const inputCellStyle = {
  width: '100%',
  padding: '5px',
  border: '1px solid #ddd',
  outline: 'none',
  textAlign: 'center' as React.CSSProperties['textAlign'],
  backgroundColor: '#fff',
  fontSize: '14px',
  color: 'black',
};

// Styling for divider rows
const dividerStyle: React.CSSProperties = {
  textAlign: 'center',
  fontWeight: 'bold',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ddd',
  padding: '10px',
};

export default FormBuilder;
