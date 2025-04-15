import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Table } from "@radix-ui/themes";
import { Card, Heading, Text, Button, Flex, Alert} from "@aws-amplify/ui-react";
import { SaveFormAfterTest, SubmitForm } from "../actions/form";

const RunningForm = () => {
  const location = useLocation(); // Get the location object
  const formData = location.state; // Get the form data passed via navigation

  // Log the entire formData object to inspect its structure
  //split the information from formData comming from different screens (RunForm and ProjectLog)
  const formID = formData?.form?.formID || formData.form.id;
  const tagID = formData?.equipmentTagID || formData?.createdTagID;
  const equipmentTag = formData?.form?.equipmentTag || formData.equipmentTag;
  const equipmentName = formData?.form?.equipmentName || formData.equipmentName;
  const documentName = formData?.form?.formName || formData.form.title;
  const testDescription = formData?.form?.description;
  const tagCreatedAt = formData.tagCreatedAt;
  // Include the createdTagID if needed in the next screen

  if (!formID) {
    console.error("Form ID is missing or not accessible.");
    return <div>Error: Form ID is not available.</div>;
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
      //console.log("Saving form with ID:", formID); // Log the form ID being used

      // Call the UpdateFormContent function with the form ID and stringified form data
      const updatedForm = await SaveFormAfterTest(formID, tagID, formDataString);

      console.log("Form saved successfully:", updatedForm);
      // You can add any additional handling after the form save here
    } catch (error) {
      console.error("Error saving form:", error);
    }
  }

  async function handleSubmit(): Promise<void> {
    try {
      if (!formID) {
        console.error("Form ID is missing");
        alert("Form ID is missing. Please ensure the form is created or selected.");
        return;
      }
  
      const formData = gatherFormData();
      const formDataString = JSON.stringify(formData);
  
      // Save the content into FormTag2 (as test content)
      const updatedForm = await SaveFormAfterTest(formID, tagID, formDataString);
      console.log("Form saved after test:", updatedForm);
  
      // Submit the content as a formal submission
      const submission = await SubmitForm(formID, formDataString);
      console.log("Form submitted successfully:", submission);
  
      alert("Form has been successfully submitted!");
  
      // Redirect or perform any additional actions after submission
      window.history.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  }

  return (
    <Flex direction="column" height="100vh" width="100%" padding="0.5rem" gap="0.1rem">
      <div style={{ flexShrink: 0, overflowY: "auto", maxHeight: "40vh", marginTop: "4rem" }}>
        <Card variation="outlined" width="100%" padding="large" style={{ backgroundColor: "white" }}>
          {/* Header Section */}
          <Flex direction="row" justifyContent="space-between" alignItems="flex-start" marginBottom="1rem">
            <Flex direction="column" gap="0.5rem">
              <Heading level={3}>Audit Report</Heading>

              <Flex direction="column">
                <Text fontWeight="bold" style={{ wordWrap: 'break-word' }}>Test Operator</Text>
                <Flex justifyContent="space-between" width="20rem">
                  <Text style={{ wordWrap: 'break-word' }}>Name: ___________________</Text>
                  <Text style={{ wordWrap: 'break-word' }}>Signed: ___________</Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex direction="column" alignItems="flex-end">
              <img src="/logo.png" alt="Logo" style={{ height: "150px", marginBottom: "0.5rem" }} />
              <Text fontWeight="bold">{formData.form.title}</Text>
            </Flex>
          </Flex>


          <Flex direction="column" border="1px solid #000" marginBottom="1rem" gap="0">
            <Flex backgroundColor="#e0e0e0" padding="0.5rem" justifyContent="center">
              <Text fontWeight="bold">Project Information</Text>
            </Flex>

            <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
              <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text fontWeight="bold">Client:</Text>
              </Flex>
              <Flex width="80%" padding="0.5rem">
                <Text style={{ wordWrap: 'break-word', maxWidth: "1600px" }}>{formData.form.clientName}</Text>
              </Flex>
            </Flex>

            <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
              <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text fontWeight="bold">Project:</Text>
              </Flex>
              <Flex width="28.5%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text style={{ wordWrap: 'break-word', maxWidth: "800px" }}>{formData.form.projectName}</Text>
              </Flex>
              <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text fontWeight="bold">Project ID:</Text>
              </Flex>
              <Flex width="30%" padding="0.5rem">
                <Text style={{ wordWrap: 'break-word', maxWidth: "800px" }}>{formData.form.projectID}</Text>
              </Flex>
            </Flex>

            <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
              <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text fontWeight="bold">Equipment Name:</Text>
              </Flex>
              <Flex width="28.5%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text style={{ wordWrap: 'break-word', maxWidth: "800px" }}>{equipmentName}</Text>
              </Flex>
              <Flex width="20%" style={{ borderRight: "1px solid #000", height: "100%" }} padding="0.5rem">
                <Text fontWeight="bold">Equipment Tag:</Text>
              </Flex>
              <Flex width="30%" padding="0.5rem">
                <Text style={{ wordWrap: 'break-word', maxWidth: "800px" }}>{equipmentTag}</Text>
              </Flex>
            </Flex>

            <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
              <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text fontWeight="bold">Document Name:</Text>
              </Flex>
              <Flex width="80%" padding="0.5rem" alignItems="stretch">
                <Text style={{ wordWrap: 'break-word', maxWidth: "1600px" }}>{documentName}</Text>
              </Flex>
            </Flex>

            <Flex style={{ borderTop: "1px solid #000" }} alignItems="stretch" gap="0">
              <Flex width="20%" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
                <Text fontWeight="bold">Description:</Text>
              </Flex>
              <Flex width="80%" padding="0.5rem">
                <Text style={{ wordWrap: 'break-word', maxWidth: "1600px" }}>{testDescription}</Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Test Duration Row */}
          <Flex border="1px solid #000" alignItems="stretch" >
            <Flex width="33.33%" justifyContent="center" alignItems="center" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
              <Text fontWeight="bold" style={{ wordWrap: 'break-word' }}>Start date/time</Text>
            </Flex>
            <Flex width="33.33%" justifyContent="center" alignItems="center" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
              <Text fontWeight="bold" style={{ wordWrap: 'break-word' }}>Stop date/time</Text>
            </Flex>
            <Flex width="33.33%" justifyContent="center" alignItems="center" padding="0.5rem">
              <Text fontWeight="bold" style={{ wordWrap: 'break-word' }}>Duration</Text>
            </Flex>
          </Flex>
          <Flex style={{ borderTop: "0px solid #000", borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000" }} alignItems="stretch" >
            <Flex width="33.33%" justifyContent="center" alignItems="center" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
              <Text fontWeight="bold" style={{ wordWrap: 'break-word' }}>{tagCreatedAt}</Text>
            </Flex>
            <Flex width="33.33%" justifyContent="center" alignItems="center" style={{ borderRight: "1px solid #000" }} padding="0.5rem">
              <Text fontWeight="bold" style={{ wordWrap: 'break-word' }}>""""""""</Text>
            </Flex>
            <Flex width="33.33%" justifyContent="center" alignItems="center" padding="0.5rem">
              <Text fontWeight="bold" style={{ wordWrap: 'break-word' }}>""""""""</Text>
            </Flex>
          </Flex>

        </Card>
      </div>


      {/* Display the content as a Radix UI Table */}
      
      <Flex direction="column"
        style={{
          maxHeight: '600px',
          overflowY: 'auto',
          overflowX: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          backgroundColor: "white"
        }}>
        <Table.Root aria-label="Editable table">

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
                          style={{
                            padding: '5px',
                            border: '1px solid #ddd',
                            outline: 'none',
                            backgroundColor: '#fff',
                            fontSize: '14px',
                            color: 'black',
                            resize: 'none', // Prevent manual resizing
                            overflow: 'hidden', // Hide overflow
                            wordWrap: 'break-word', // Ensure words break within the cell
                            whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
                            textAlign: 'center',
                            width: '100%',
                            minHeight: '30px', // Minimum height
                          }}
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
        <Button style={{ padding: '10px', width: '100px' }} variation="primary" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </Flex>
    </Flex >
  );
};

export default RunningForm;
