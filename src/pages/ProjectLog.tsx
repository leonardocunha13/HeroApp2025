import { useEffect, useState } from "react";
import { Collection, Card, Heading, Flex, Text, Loader, Badge, SelectField, Button } from "@aws-amplify/ui-react";
import { GetFormsByClientName, GetClients } from "../actions/form"; // Replace with your actual data fetching functions
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

const ProjectLog = () => {
    const navigate = useNavigate();
    const [formsData, setFormsData] = useState<any[]>([]);  // Flattened data
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [clients, setClients] = useState<string[]>([]); // State for holding client list
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState<any>(null);

    // Fetch list of clients from getClient function
    const fetchClients = async () => {
        try {
            const clientList = await GetClients(); // Assuming getClient fetches a list of clients
            setClients(clientList.clientNames); // Set the client names to state
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    // Fetch data based on the selected client
    const fetchData = async () => {
        if (!selectedClient) return;

        setLoading(true);
        try {
            const data = await GetFormsByClientName(selectedClient); // Fetch forms data for selected client

            // Flatten the equipment details to create separate cards
            const flattenedData = data.flatMap((form) =>
                form.equipmentDetails.map((equipment) => ({
                    clientName: form.clientName,
                    projectName: form.projectName || '',
                    projectID: form.projectID,
                    formName: form.formName || '',
                    equipmentName: equipment.equipmentName,
                    equipmentTag: equipment.equipmentTag,
                    submission: form.submission,
                    formID: form.formID,
                    badges: [form.clientName, form.projectID],
                }))
            );

            setFormsData(flattenedData);
        } catch (error) {
            console.error("Error fetching forms data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false); // Close the dialog
    };

    const openDialog = (form: any) => {
        setSelectedForm(form);
        setIsDialogOpen(true);
    };
    
    const handleResumeTest = () => {
        navigate("/RunningForm", { state: { form: selectedForm, formID: selectedForm.formID } });
        console.log("Resuming test...");
        console.log("sELECTED FORM", selectedForm);
        console.log("id", selectedForm.formID);
    };

    // Use effect to fetch clients and forms data when client changes
    useEffect(() => {
        fetchClients(); // Fetch clients on initial load
    }, []);

    useEffect(() => {
        fetchData(); // Fetch forms data when selected client changes
    }, [selectedClient]);

    return (
        <div style={{ width: "100%", padding: "10px" }}>
            {/* Client Dropdown */}
            <SelectField
                label="Select Client"
                descriptiveText="Please select a client to view the forms"
                value={selectedClient || ''}
                onChange={(e) => setSelectedClient(e.target.value)}
                style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}
            >
                <option value="">Select Client</option>
                {clients.map((client) => (
                    <option key={client} value={client}>
                        {client}
                    </option>
                ))}
            </SelectField>

            {/* Loading state */}
            {loading ? (
                <Flex justifyContent="center" alignItems="center" height="50vh">
                    <Loader variation="linear" />
                </Flex>
            ) : (
                // Collection of Cards to show the data
                <Collection
                    items={formsData}
                    type="grid"
                    templateColumns={{
                        base: "1fr",        // 1 column on small screens (phones)
                        small: "1fr 1fr",    // 2 columns on medium screens (tablets)
                        medium: "1fr 1fr 1fr", // 3 columns on larger screens (desktops)
                    }}
                    gap="20px"
                    position="relative"  // Fixed position to the top
                    isPaginated
                    itemsPerPage={6}
                >
                    {(item, index) => (
                        <div key={index} style={{ maxWidth: '100%' }}>
                            <Card
                                borderRadius="medium"
                                marginTop="small"
                                width="100%"  // Ensures the card takes full width available
                                maxWidth="15rem"  // Max width for larger screens
                                height="auto"  // Auto height for better responsiveness
                                variation="outlined"
                                padding="medium"
                                onClick={() => openDialog(item)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden',
                                    boxSizing: 'border-box',
                                }}
                            >
                                {/* Card Content */}
                                <Heading level={5} paddingBottom="small" style={{ fontSize: '0.9rem' }}>
                                    {item.formName || 'Form Name'}
                                </Heading>

                                <Text paddingBottom="small" fontWeight="bold" color="gray.60" style={{ fontSize: '0.75rem' }}>
                                    Project: {item.projectName || 'N/A'}
                                </Text>

                                <Flex gap="small" paddingBottom="small">
                                    {item.badges.map((badge: string, i: number) => (
                                        <Badge key={i} backgroundColor="yellow.40" style={{ fontSize: '0.7rem' }}>
                                            {badge}
                                        </Badge>
                                    ))}
                                </Flex>

                                {/* Equipment Details */}
                                <Flex direction="column" gap="small">
                                    <Card
                                        borderRadius="medium"
                                        variation="outlined"
                                        padding="small"
                                        style={{
                                            backgroundColor: "#f8f8f8",
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        <Text>Equipment: {item.equipmentName}</Text>
                                        <Text>Tag: {item.equipmentTag}</Text>
                                    </Card>
                                </Flex>
                            </Card>
                        </div>
                    )}
                </Collection>
            )}

            {/* Dialog for displaying detailed info */}
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title>Test Details</Dialog.Title>
                    <Dialog.Description>
                        <Text fontSize="1rem" fontWeight="bold" style={{ marginTop: "8px" }}><strong>Project Name:</strong> {selectedForm?.projectName}</Text>
                        <Text fontSize="1rem" fontWeight="bold" style={{ marginTop: "8px" }}><strong>Form Name:</strong> {selectedForm?.formName}</Text>
                        <Text fontSize="1rem" fontWeight="bold" style={{ marginTop: "8px" }}><strong>Equipment:</strong> {selectedForm?.equipmentName}</Text>
                        <Text fontSize="1rem" fontWeight="bold" style={{ marginTop: "8px" }}><strong>Tag:</strong> {selectedForm?.equipmentTag}</Text>
                        <Text fontSize="1rem" fontWeight="bold" style={{ marginTop: "8px" }}><strong>Status:</strong> {selectedForm?.submission === 1 ? (
                            <Text color="green" fontWeight="bold">Test Finished</Text>
                        ) : (
                            <Text color="red" fontWeight="bold">Test not Finished</Text>
                        )}</Text>
                    </Dialog.Description>
                    <Dialog.Close asChild>
                        <Button style={{ backgroundColor: 'gray', marginRight: '10px' }} onClick={handleClose}>
                            Close
                        </Button>
                    </Dialog.Close>
                    <Button
                        onClick={handleResumeTest}
                        isDisabled={selectedForm?.submission === 1}
                    >
                        Resume Test
                    </Button>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
};

export default ProjectLog;
