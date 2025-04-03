import { useLocation, useParams } from "react-router-dom";
import { Card, Heading, Text, Button, Flex } from "@aws-amplify/ui-react";

const RunningForm = () => {
    const location = useLocation();
    const { projectID } = useParams();
    const formData = location.state; // Dados do formulário passados pela navegação
    
    if (!formData) {
        return <Text>No form data found.</Text>;
    }

    return (
        <Flex justifyContent="center" alignItems="center" height="100vh">
            <Card variation="outlined" width="40rem" padding="medium">
                <Heading level={3}>{formData.title}</Heading>
                <Text fontSize="large" fontWeight="bold">Client: {formData.clientName}</Text>
                <Text fontSize="large">Project: {formData.projectName}</Text>
                <Text fontSize="large">Project ID: {projectID}</Text>
                <Text fontSize="large">Description: {formData.description}</Text>
                <Button onClick={() => window.history.back()}>Go Back</Button>
            </Card>
        </Flex>
    );
};

export default RunningForm;
