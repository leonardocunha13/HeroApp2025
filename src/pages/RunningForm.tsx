import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Table } from "@radix-ui/themes";
import { Card, Heading, Text, Button, Flex } from "@aws-amplify/ui-react";
import { UpdateFormContent, PublishForm } from "../actions/form";

const RunningForm = () => {
  const location = useLocation(); // Get the location object
  const formData = location.state; // Get the form data passed via navigation
  const formID = formData.form.id;
  console.log("formID:", formID);
  if (!formData) {
    return <Text>No form data found.</Text>;
  }

  let table: (string | number)[][] = [];
  let readOnlyCols: string[] = [];
  let readOnlyRows: string[] = [];

  if (typeof formData.content === "string") {
    try {
      const parsed = JSON.parse(formData.content);
      table = parsed.table;
      readOnlyCols = parsed.readOnlyColumns || [];
      readOnlyRows = parsed.readOnlyRows || [];
    } catch (error) {
      console.error("Error parsing form content:", error);
    }
  } else {
    table = formData.content.table || [];
    readOnlyCols = formData.content.readOnlyColumns || [];
    readOnlyRows = formData.content.readOnlyRows || [];
  }

  if (!Array.isArray(table) || table.length === 0) {
    return <Text>No content available.</Text>;
  }

  //const headers: string[] = table[0] as string[]; // Assuming the first row contains the headers
  const [tableData, setTableData] = useState(table);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][colIndex] = value;
    setTableData(updatedData);
  };

  const generateColumnLetter = (index: number): string => {
    let letter = "";
    while (index >= 0) {
      letter = String.fromCharCode((index % 26) + 65) + letter;
      index = Math.floor(index / 26) - 1;
    }
    return letter;
  };

  const gatherFormData = () => {
    return {
      table: tableData,
      readOnlyColumns: readOnlyCols,
      readOnlyRows: readOnlyRows,
    };
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

  return (
    <Flex justifyContent="center" alignItems="center" direction="column" height="100vh" >
      <Card variation="outlined" width="40rem" padding="medium">
        <Heading level={3}>{formData.form.title}</Heading>
        <Text fontSize="large" fontWeight="bold">
          Client: {formData.form.clientName}
        </Text>
        <Text fontSize="large">Project: {formData.form.projectName}</Text>
        <Text fontSize="large">Project ID: {formData.form.projectID}</Text>
        <Text fontSize="large">Description: {formData.form.description}</Text>

        {/* Display the equipment details */}
        <Text fontSize="large">Equipment Name: {formData.equipmentName}</Text>
        <Text fontSize="large">Equipment Tag: {formData.equipmentTag}</Text>
      </Card>

      {/* Display the content as a Radix UI Table */}
      <Flex justifyContent="center" alignItems="center" direction="column" backgroundColor="white">
        <Table.Root aria-label="Editable table">
          <Table.Header>
            <Table.Row>

            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.slice(0).map((row, rowIndex) => (
              <Table.Row key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const colLetter = generateColumnLetter(colIndex);
                  const isReadOnly =
                    readOnlyCols.includes(colLetter) ||
                    readOnlyRows.includes(rowIndex.toString());

                  return (
                    <Table.Cell key={colIndex}>
                      {isReadOnly ? (
                        <Text>{cell}</Text>
                      ) : (
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(rowIndex, colIndex, e.target.value)
                          }
                          style={{ width: "100%" }}
                        />
                      )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Flex>
      <Flex justifyContent="flex-end" gap="1rem" marginTop="1rem">
        <Button style={{ padding: '10px', width: '100px' }} onClick={() => window.history.back()}>
          Go Back
        </Button>
        <Button style={{ padding: '10px', width: '100px' }} onClick={() => handleSave()}>
          Save
        </Button>
        <Button style={{ padding: '10px', width: '100px' }} variation="primary" onClick={() => window.history.back()}>
          Finish
        </Button>
      </Flex>
    </Flex>
  );
};

export default RunningForm;
