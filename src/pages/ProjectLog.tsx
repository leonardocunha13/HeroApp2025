import { useEffect, useState } from "react";
import { Collection, Card, Heading, Flex, Text, Loader, Badge, SelectField } from "@aws-amplify/ui-react";
import { GetFormsByClientName, GetClients } from "../actions/form"; // Replace with your actual data fetching functions
import { Cross2Icon } from "@radix-ui/react-icons";

interface EquipmentDetails {
    equipmentName: string;
    equipmentTag: string;
}

interface FormData {
    clientName: string;
    projectName: string | undefined;
    projectID: string;
    formName: string | undefined;
    equipmentDetails: EquipmentDetails[];
    badges: string[]; // Explicitly typed as an array of strings
}

const ProjectLog = () => {
    const [formsData, setFormsData] = useState<any[]>([]);  // Flattened data
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [clients, setClients] = useState<string[]>([]); // State for holding client list

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

    // Use effect to fetch clients and forms data when client changes
    useEffect(() => {
        fetchClients(); // Fetch clients on initial load
    }, []);

    useEffect(() => {
        fetchData(); // Fetch forms data when selected client changes
    }, [selectedClient]);

    return (
        <div>
            {/* Client Dropdown */}
            <SelectField
                label="Select Client"
                descriptiveText="Please select a client to view the forms"
                value={selectedClient || ''}
                onChange={(e) => setSelectedClient(e.target.value)}
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
                    //isSearchable
                    isPaginated
                    itemsPerPage={6}
                >
                    {(item, index) => (
                        <div key={index}>
                            {/* Individual Card for Equipment Tag */}
                            <Card
                                borderRadius="medium"
                                marginTop="small"
                                width="15rem"
                                height="13rem"
                                variation="outlined"
                                padding="medium"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden',
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
        </div>
    );
};

export default ProjectLog;
