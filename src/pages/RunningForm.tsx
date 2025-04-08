import { useLocation, useParams } from "react-router-dom";
import { Card, Heading, Text, Button, Flex } from "@aws-amplify/ui-react";

const RunningForm = () => {
  const location = useLocation();  // Get the location object
  const formData = location.state;  // Get the form data passed via navigation

  if (!formData) {
    return <Text>No form data found.</Text>;
  }
  //console.log("Form Data:", formData);  // Log the form data for debugging
  //console.log("Project ID:", projectID);  // Log the project ID for debugging
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Card variation="outlined" width="40rem" padding="medium">
        <Heading level={3}>{formData.form.title}</Heading>
        <Text fontSize="large" fontWeight="bold">Client: {formData.form.clientName}</Text>
        <Text fontSize="large">Project: {formData.form.projectName}</Text>
        <Text fontSize="large">Project ID: {formData.form.projectID}</Text>
        <Text fontSize="large">Description: {formData.form.description}</Text>
        
        {/* Display the equipment details */}
        <Text fontSize="large">Equipment Name: {formData.equipmentName}</Text>
        <Text fontSize="large">Equipment Tag: {formData.equipmentTag}</Text>

        <Button onClick={() => window.history.back()}>Go Back</Button>
      </Card>
    </Flex>
  );
};

export default RunningForm;
