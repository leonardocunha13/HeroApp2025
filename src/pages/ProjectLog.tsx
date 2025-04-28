import { useEffect, useState } from "react";
import { Collection, Card, Heading, Flex, Text, Loader, Badge, SelectField, Button } from "@aws-amplify/ui-react";
import { GetFormsByClientName, GetClients, getContentByFormIDandTagID, getEquipmentTagID } from "../actions/form"; // Replace with your actual data fetching functions
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
            const flattenedData = await Promise.all(
                data.flatMap(async (form) => {
                    const equipmentData = await Promise.all(
                        form.equipmentDetails.map(async (equipment) => {
                            // Get the tagID using the equipment's name and tag
                            const equipmentTagID = await getEquipmentTagID(equipment.equipmentName, equipment.equipmentTag);

                            // If the tagID is not found, skip this equipment
                            if (!equipmentTagID) {
                                console.error("No tagID found for equipment:", equipment);
                                return;
                            }

                            // Fetch the content using formID and equipmentTagID
                            const content = await getContentByFormIDandTagID(form.formID, equipmentTagID);

                            return {
                                clientName: form.clientName,
                                projectName: form.projectName || '',
                                projectID: form.projectID,
                                formName: form.formName || '',
                                description: form.description || '',
                                TagCreatedAt: equipment.tagCreatedAt,
                                equipmentName: equipment.equipmentName,
                                equipmentTag: equipment.equipmentTag,
                                submission: form.submission,
                                formID: form.formID,
                                badges: [form.clientName, form.projectID],
                                content: content || '',
                            };
                        })
                    );

                    return equipmentData;
                })
            );

            // Flatten the results (in case nested arrays are returned from Promise.all)
            setFormsData(flattenedData.flat());
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

    const handleResumeTest = async () => {
        if (!selectedForm) return;

        try {
            // Assuming the selected equipment tag is part of the selectedForm
            const equipmentTagID = await getEquipmentTagID(selectedForm.equipmentName, selectedForm.equipmentTag);

            // If the tagID is not found, log an error and exit
            if (!equipmentTagID) {
                console.error("No tagID found for the selected form's equipment.");
                return;
            }
            const content = await getContentByFormIDandTagID(selectedForm.formID, equipmentTagID);
            navigate(`/RunningForm/${equipmentTagID}`, {
                state: {
                    form: selectedForm,
                    equipmentTagID: equipmentTagID,
                    formID: selectedForm.formID,
                    tagCreatedAt: selectedForm.TagCreatedAt,
                    content: content || '' // Send the fetched content along
                }
            });
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    };
    // Use effect to fetch clients and forms data when client changes
    useEffect(() => {
        fetchClients(); // Fetch clients on initial load
    }, []);

    useEffect(() => {
        fetchData(); // Fetch forms data when selected client changes
    }, [selectedClient]);

    async function GenerateReport(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
        if (!selectedForm) {
            console.error("No form selected for generating the report.");
            return;
        }

        try {
            // Assuming the selected equipment tag is part of the selectedForm
            const equipmentTagID = await getEquipmentTagID(selectedForm.equipmentName, selectedForm.equipmentTag);

            if (!equipmentTagID) {
                console.error("No tagID found for the selected form's equipment.");
                return;
            }

            // Fetch the content using formID and equipmentTagID
            const content = await getContentByFormIDandTagID(selectedForm.formID, equipmentTagID);

            // Generate the report (this could involve creating a downloadable file, sending data to a server, etc.)
            const reportData = {
                projectName: selectedForm.projectName,
                formName: selectedForm.formName,
                equipmentName: selectedForm.equipmentName,
                equipmentTag: selectedForm.equipmentTag,
                content: content || "No content available",
            };

            // Example: Log the report data or send it to a server
            console.log("Generated Report:", reportData);

            // Optionally, trigger a download of the report as a JSON file
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedForm.projectName || "report"}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating report:", error);
        }
    }

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
                        base: "1fr",
                        small: "1fr 1fr",
                        medium: "1fr 1fr 1fr",
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
                                width="100%"
                                maxWidth="15rem"
                                height="16Rem"
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
                                <Text>
                                    <strong>Status:</strong>{" "}
                                    <span style={{ color: selectedForm?.submission === 1 ? 'green' : 'red' }}>
                                        {selectedForm?.submission === 1 ? "Test Finished" : "Test not Finished"}
                                    </span>
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
                    <Dialog.Description asChild>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <Text><strong>Project Name:</strong> {selectedForm?.projectName}</Text>
                            <Text><strong>Form Name:</strong> {selectedForm?.formName}</Text>
                            <Text><strong>Equipment:</strong> {selectedForm?.equipmentName}</Text>
                            <Text><strong>Tag:</strong> {selectedForm?.equipmentTag}</Text>
                        </div>
                    </Dialog.Description>
                    <Dialog.Close asChild>
                        <Button style={{ backgroundColor: 'gray', marginRight: '10px' }} onClick={handleClose}>
                            Close
                        </Button>
                    </Dialog.Close>
                    <Button style={{  marginRight: '10px' }}
                        onClick={handleResumeTest}
                        isDisabled={selectedForm?.submission === 1}
                    >
                        Resume Test
                    </Button>
                    <Button
                        onClick={GenerateReport}
                        isDisabled={selectedForm?.submission === 0}
                    >
                        Generate Report
                    </Button>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
};

export default ProjectLog;
