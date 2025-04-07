import { useLocation, useParams } from "react-router-dom";
import { Card, Heading, Text, Button, Flex } from "@aws-amplify/ui-react";

const RunningForm = () => {
    const location = useLocation();  // Get the location object
    const { projectID } = useParams();  // Get the projectID from URL params
    const formData = location.state;  // Get the form data passed via navigation
    
    if (!formData) {
        return <Text>No form data found.</Text>;
    }

    return (
        
        <Flex justifyContent="center" alignItems="center" height="100vh">
            <Card variation="outlined" width="40rem" padding="medium">
                <Heading level={3}>{formData.form.title}</Heading>
                <Text fontSize="large" fontWeight="bold">Client: {formData.form.clientName}</Text>
                <Text fontSize="large">Project: {formData.form.projectName}</Text>
                <Text fontSize="large">Project ID: {projectID}</Text>
                <Text fontSize="large">Description: {formData.form.description}</Text>
                <Button onClick={() => window.history.back()}>Go Back</Button>
            </Card>
        </Flex>
    );
};

export default RunningForm;
