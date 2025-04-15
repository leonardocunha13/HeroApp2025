import React, { useEffect, useState } from 'react';
import { Table } from "@radix-ui/themes";
import { ThemeProvider, Theme, Button, Input, CheckboxField, Flex, Text, Card, Heading } from '@aws-amplify/ui-react';
import { useLocation } from "react-router-dom";
import { UpdateFormContent, PublishForm } from "../actions/form";
import * as XLSX from 'xlsx';

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
  const formID = location.state?.idform || location.state?.form?.id;
  const formName = location.state?.name || location.state?.form?.title;
  //const formDescription = location.state?.description || location.state?.form?.description;
  const formClient = location.state?.client || location.state?.form?.clientName;
  const formProject = location.state?.projID || location.state?.form?.projectName;
  const formProjectID = location.state?.projectID || location.state?.form?.projectID;

  if (!formData) {
    return <div>No form data found.</div>;
  }

  const [tableData, setTableData] = useState<TableData>(() => {
    if (formData?.content) {
      try {
        const parsed = JSON.parse(formData.content);
        return Array.isArray(parsed.table) ? parsed.table : [['']];
      } catch (e) {
        console.error("Error to parse:", e);
        return [['']];
      }
    } else {
      return Array.from({ length: 5 }, () => Array(5).fill(''));
    }
  });

  useEffect(() => {
    if (formData?.content) {
      try {
        const parsed = JSON.parse(formData.content);
        setReadOnlyColumns(parsed.readOnlyColumns || []);
        setReadOnlyRows(parsed.readOnlyRows || []);
      } catch (e) {
        console.error("Erro to parse:", e);
      }
    }
  }, []);


  const [rowInput, setRowInput] = useState('');
  const [colInput, setColInput] = useState('');
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

  // Gather the form data and structure it properly
  const gatherFormData = () => {
    const formData = tableData.map((row) => {
      return row.map((cell) => {
        // Ensure the cell is a string before trimming
        return typeof cell === 'string' ? cell.trim() : String(cell).trim();
      });
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
  //console.log("Rows:", readOnlyRows);
  const toggleReadOnlyRows = (rowKey: string) => {
    setReadOnlyRows((prev) =>
      prev.includes(rowKey)
        ? prev.filter((r) => r !== rowKey)
        : [...prev, rowKey]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const binaryStr = event.target.result as string;
          const wb = XLSX.read(binaryStr, { type: 'binary' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); // 2D array

          // Normalize data to ensure all rows have the same number of columns
          const maxCols = Math.max(...data.map((row) => (row as string[]).length));
          const normalizedData = (data as string[][]).map((row) => {
            const newRow = [...row];
            while (newRow.length < maxCols) {
              newRow.push("");
            }
            return newRow;
          });

          setTableData(normalizedData as TableData);

          // Adjust dimensions of input cells
          setTimeout(() => {
            const inputs = document.querySelectorAll("input[type='text']") as NodeListOf<HTMLInputElement>;
            inputs.forEach((input) => {
              adjustCellDimensions(input); // Adjust dimensions after table is populated
            });
          }, 0); // Ensure DOM is updated first
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (event) =>
      handleFileUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  const adjustCellDimensions = (input: HTMLInputElement) => {
    // Reset the width and height to auto for recalculation
    input.style.width = 'auto';
    input.style.height = 'auto';

    // Create a temporary span to calculate the width of the content
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'pre-wrap';
    span.style.wordWrap = 'break-word';
    span.style.fontFamily = 'Arial'; // Match the font
    span.style.fontSize = '14px'; // Match the font size

    // Set the span's content to the value of the input
    span.textContent = input.value;

    // Append the span to the document temporarily to get the content width
    document.body.appendChild(span);

    // Set the width of the input to the span's scroll width (content width)
    const newWidth = Math.min(span.scrollWidth, 500); // Max width 500px
    input.style.width = `${newWidth}px`;

    // Remove the span after measurement
    document.body.removeChild(span);

    // Adjust the height based on scrollHeight (height of the content)
    input.style.height = `${input.scrollHeight}px`;
  };

  useEffect(() => {
    const inputs = document.querySelectorAll("input[type='text']") as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
      adjustCellDimensions(input); // Adjust each cell's dimensions
    });
  }, [tableData]); // Trigger when tableData changes

  return (
    <ThemeProvider theme={theme} colorMode="light">
      <Flex direction="column" alignItems="center">
        {/* Sticky Card Header */}
        <div className="sticky top-0 bg-white z-10 w-full">
          <Card variation="outlined" width="100%" padding="large" style={{ backgroundColor: "white" }}>

            {/* Header Section */}
            <Flex direction="row" justifyContent="space-between" alignItems="flex-start" marginBottom="1rem">
              <Flex direction="column" gap="0.5rem" alignItems="center">
                <Heading level={3}>Audit Form Builder</Heading>
              </Flex>

              <Flex direction="column" alignItems="flex-end">
                <img src="/logo.png" alt="Logo" style={{ height: "100px", marginBottom: "0.5rem" }} />
              </Flex>
            </Flex>
            <Flex direction="column" border="1px solid #000" marginBottom="1rem" gap="0">
              <Flex backgroundColor="#e0e0e0" padding="0.5rem" justifyContent="center">
                <Text fontWeight="bold" fontSize={24}>Audit Form Information</Text>
              </Flex>

              <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
                <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                  <Text fontWeight="bold">Client:</Text>
                </Flex>
                <Flex width="80%" padding="0.5rem">
                  <Text style={{ wordWrap: 'break-word', maxWidth: "1600px" }}>{formClient}</Text>
                </Flex>
              </Flex>

              <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
                <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                  <Text fontWeight="bold">Project:</Text>
                </Flex>
                <Flex width="28.5%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                  <Text style={{ wordWrap: 'break-word', maxWidth: "800px" }}>{formProject}</Text>
                </Flex>
                <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                  <Text fontWeight="bold">Project ID:</Text>
                </Flex>
                <Flex width="30%" padding="0.5rem">
                  <Text style={{ wordWrap: 'break-word', maxWidth: "800px" }}>{formProjectID}</Text>
                </Flex>
              </Flex>

              <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
                <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                  <Text fontWeight="bold">Equipment Name:</Text>
                </Flex>
                <Flex width="28.5%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                  <Text style={{ wordWrap: 'break-word', maxWidth: "800px" }}>N/A</Text>
                </Flex>
                <Flex width="20%" style={{ borderRight: "1px solid #000", height: "100%" }} padding="0.5rem">
                  <Text fontWeight="bold">Equipment Tag:</Text>
                </Flex>
                <Flex width="30%" padding="0.5rem">
                  <Text style={{ wordWrap: 'break-word', maxWidth: "800px" }}>N/A</Text>
                </Flex>
              </Flex>

              <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
                <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                  <Text fontWeight="bold">Document Name:</Text>
                </Flex>
                <Flex width="80%" padding="0.5rem" alignItems="stretch">
                  <Text style={{ wordWrap: 'break-word', maxWidth: "1600px" }}>{formName}</Text>
                </Flex>
              </Flex>

              {/*<Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
              <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text fontWeight="bold">Description:</Text>
              </Flex>
              <Flex width="80%" padding="0.5rem">
                <Text style={{ wordWrap: 'break-word', maxWidth: "1600px" }}>{formDescription}</Text>
              </Flex>
            </Flex>*/}
            </Flex>
            <Flex direction="column" gap="0.5rem" alignItems="center" marginBottom={"1rem"}>
              <Heading level={4}>Form Control</Heading>
            </Flex>
            {/*Control Buttons*/}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button ariaLabel="Import Excel" backgroundColor="blue.20" borderRadius="1rem" color="black" fontWeight="normal" onClick={handleImport} size="small" width="9rem" marginBottom="5px">Import Excel</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button ariaLabel="Add Row" backgroundColor="#ffd811" borderRadius="1rem" color="black" fontWeight="normal" onClick={addRow} size="small" width="9rem" marginBottom="5px">Add Row</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button ariaLabel="Remove Row" backgroundColor="#ffd811" borderRadius="1rem" color="black" fontWeight="normal" onClick={handleRemoveRow} size="small" width="9rem">Remove Row</Button>
                <Input size="small" width="9rem" type="number" borderColor="black" value={rowInput} onChange={(e) => setRowInput(e.target.value)} placeholder="Row number" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button ariaLabel="Add Column" backgroundColor="#ffd811" borderRadius="1rem" color="black" fontWeight="normal" onClick={addColumn} size="small" width="9rem" marginBottom="5px">Add Column</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button ariaLabel="Remove Column" backgroundColor="#ffd811" borderRadius="1rem" color="black" fontWeight="normal" onClick={handleRemoveColumn} size="small" width="9rem">Remove Column</Button>
                <Input size="small" style={{ width: '9rem', minWidth: '9rem' }} type="text" borderColor="black" value={colInput} onChange={(e) => setColInput(e.target.value)} placeholder="Column letter" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button ariaLabel="Publish" variation="primary" borderRadius="1rem" color="black" fontWeight="normal" onClick={handlePublish} size="small" width="9rem">Publish</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button ariaLabel="Save Form" backgroundColor="grey" borderRadius="1rem" color="black" fontWeight="normal" onClick={handleSave} size="small" width="9rem">Save Form</Button>
              </div>
            </div>
          </Card>
        </div>
        {/* Table Section */}
        <div style={{ width: '100%', maxHeight: '35vh', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', backgroundColor: 'white' }}>
          <Flex direction="column" alignItems="center">
            <Table.Root aria-label="Form Table">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                  {Array.from({ length: tableData[0].length }, (_, index) => {
                    const colLetter = generateColumnLetter(index);
                    return (
                      <Table.ColumnHeaderCell key={`header-${index}`}>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-sm font-semibold">{colLetter}</span>
                          <CheckboxField
                            label={``}
                            name={`column-${colLetter}`}
                            checked={readOnlyColumns.includes(colLetter)}
                            onChange={() => toggleReadOnly(colLetter)}
                            title={`Toggle read-only for column ${colLetter}`}
                            style={{ marginTop: '4px' }}
                          />
                        </div>
                      </Table.ColumnHeaderCell>
                    );
                  })}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableData.map((row, rowIndex) => (
                  <Table.Row key={rowIndex}>
                    <Table.RowHeaderCell>
                      <CheckboxField
                        label={`${rowIndex + 1}`}
                        name={`row-${rowIndex + 1}`}
                        checked={readOnlyRows.includes(rowIndex.toString())}
                        onChange={() => {
                          toggleReadOnlyRows(rowIndex.toString())
                          //console.log("Read-only column indexes:", rowIndex);
                        }}
                        title={`Toggle read-only for row ${rowIndex + 1}`}
                        style={{ marginRight: '4px' }}
                      />
                    </Table.RowHeaderCell>
                    {row.map((cell, colIndex) => (
                      <Table.Cell key={colIndex}>
                        <div style={{ display: 'inline-block', minWidth: '100px', maxWidth: '500px', position: 'relative' }}>
                          <textarea
                            value={cell}
                            onChange={(e) => {
                              const updatedTableData = [...tableData];
                              const updatedRow = [...updatedTableData[rowIndex]];
                              updatedRow[colIndex] = e.target.value;
                              updatedTableData[rowIndex] = updatedRow;
                              setTableData(updatedTableData);
                            }}
                            onInput={(e) => {
                              const target = e.target as HTMLInputElement; // Corrected to HTMLInputElement
                              adjustCellDimensions(target); // Pass the correct element type to the function
                            }}
                            style={{ padding: '5px', border: '1px solid #ddd', outline: 'none', backgroundColor: '#fff', fontSize: '14px', color: 'black', resize: 'both', overflow: 'hidden', textAlign: 'center', width: '100%', minHeight: '50px', minWidth: '100px', maxWidth: '400px', maxHeight: '150px' }}
                            rows={1} // Start with 1 row
                          />
                        </div>
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Flex>
        </div>
      </Flex>
    </ThemeProvider>
  );
};

export default FormBuilder;
