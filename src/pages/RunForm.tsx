import { Collection, Card, Heading, Flex, Badge, Divider, Button, Text, Loader } from "@aws-amplify/ui-react";
import { GetFormsInformation } from "../actions/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import RunningForm from '../pages/RunningForm'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//import { Cross2Icon } from "@radix-ui/react-icons";

interface Form {
    name: string | null;
    description: string | null;
}

interface ProjectItem {
    clientName: string;
    projectName: string;
    projectID: string;
    forms: Form[];
}

interface FormInfo {
    title: string | null;
    description: string | null;
    projectName: string;
    clientName: string;
    projectID: string;
    badges: string[];
}

// CollectionForms component (unchanged from your original, except the addition of triggerRefresh)

const CollectionForms = () => {
    const navigate = useNavigate();
    const [info, setInfo] = useState<FormInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState<FormInfo | null>(null);
    const [equipmentName, setEquipmentName] = useState("");
    const [equipmentTag, setEquipmentTag] = useState("");
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData: ProjectItem[] = await GetFormsInformation();
                const formattedInfo: FormInfo[] = fetchedData
                    .filter(project => project.forms.length > 0)
                    .flatMap(project =>
                        project.forms.map(form => ({
                            title: form.name,
                            description: form.description,
                            projectName: project.projectName,
                            clientName: project.clientName,
                            projectID: project.projectID,
                            badges: [project.clientName, project.projectID],
                        }))
                    );

                setInfo(formattedInfo);
            } catch (error) {
                console.error("Error fetching forms information:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refresh]); // Ensure the data gets re-fetched when the refresh state changes

    /*const triggerRefresh = () => {
        setRefresh(prev => !prev); // Toggle the refresh state to trigger useEffect
    };*/

    const openDialog = (form: FormInfo) => {
        setSelectedForm(form);
        setIsDialogOpen(true);
    };

    const handleStart = () => {
        if (equipmentName && equipmentTag && selectedForm) {
            // Log to verify the values before navigation
            console.log("Navigating with state:", {
                equipmentName,
                equipmentTag,
                form: selectedForm
            });
    
            // Navigate to the running form page, passing the necessary state
            navigate(`/RunningForm/${selectedForm.projectID}`, {
                state: {
                    equipmentName,
                    equipmentTag,
                    form: selectedForm
                }
            });
            setIsDialogOpen(false); // Close the dialog after navigating
        } else {
            alert("Please fill out both fields");
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false); // Close the dialog
    };

    return (
        <>
            {loading ? (
                <Flex justifyContent="center" alignItems="center" height="50vh">
                    <Loader variation="linear" />
                </Flex>
            ) : (
                <Collection
                    items={info}
                    type="grid"
                    templateColumns="1fr 1fr 1fr"
                    gap="15px"
                    isSearchable
                    isPaginated
                    itemsPerPage={9}
                    searchPlaceholder="Search by Client Name..."
                    searchNoResultsFound={
                        <Flex justifyContent="center">
                            <Text color="purple.80" fontSize="1rem">
                                No results found, please try again.
                            </Text>
                        </Flex>
                    }
                    searchFilter={(item, keyword) => {
                        const form = item as FormInfo;
                        return form.clientName.toLowerCase().includes(keyword.toLowerCase());
                    }}
                >
                    {(item, index) => (
                        <Card key={index} borderRadius="medium" width="20rem" variation="outlined" padding="medium">
                            <Heading level={4} paddingBottom="small">
                                {item.title}
                            </Heading>

                            <Text paddingBottom="small" fontWeight="bold" color="gray.60">
                                Project: {item.projectName}
                            </Text>

                            <Text paddingBottom="small">{item.description}</Text>

                            <Flex gap="small" paddingBottom="small">
                                {item.badges.map((badge, i) => (
                                    <Badge key={i} backgroundColor="yellow.40">
                                        {badge}
                                    </Badge>
                                ))}
                            </Flex>

                            <Divider     />
                            
                            <Button variation="primary" marginTop="small" marginLeft="medium" marginRight="medium" onClick={() => openDialog(item)}>
                                Run Form
                            </Button>
                            <Button variation="primary" marginTop="small" backgroundColor="white.40" marginRight="medium" marginLeft="medium">
                                Edit Form
                            </Button>
                        </Card>
                    )}
                </Collection>
            )}
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="text-xl font-bold mb-2">Enter Equipment Details</Dialog.Title>

                    {selectedForm && (
                        <div className="mb-4 p-3 bg-gray-100 rounded">
                            <Text fontSize="1rem" fontWeight="bold">Test Name:</Text>
                            <Text>{selectedForm.title}</Text>

                            <Text fontSize="1rem" fontWeight="bold" style={{ marginTop: "8px" }}>Client:</Text>
                            <Text>{selectedForm.clientName}</Text>

                            <Text fontSize="1rem" fontWeight="bold" style={{ marginTop: "8px" }}>Project Name:</Text>
                            <Text>{selectedForm.projectName}</Text>

                            <Text fontSize="1rem" fontWeight="bold" style={{ marginTop: "8px" }}>Project ID:</Text>
                            <Text>{selectedForm.projectID}</Text>
                        </div>
                    )}

                    <Dialog.Description className="text-gray-600 mb-4">
                        Please provide the equipment name and tag before proceeding.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" fontSize="1rem" marginBottom="1rem" fontWeight="bold">
                                Equipment Name
                            </Text>
                            <input
                                type="text"
                                placeholder="Enter Equipment Name"
                                value={equipmentName}
                                onChange={(e) => setEquipmentName(e.target.value)}
                                style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%" }}
                            />
                        </label>
                        <label>
                            <Text as="div" fontSize="1rem" marginBottom="1rem" fontWeight="bold">
                                Equipment Tag
                            </Text>
                            <input
                                type="text"
                                placeholder="Enter Equipment Tag"
                                value={equipmentTag}
                                onChange={(e) => setEquipmentTag(e.target.value)}
                                style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%" }}
                            />
                        </label>
                    </Flex>

                    <Flex gap="small" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
                        <Dialog.Close asChild>
                            <Button style={{ backgroundColor: 'gray', padding: '10px' }} onClick={handleClose}>
                                Close
                            </Button>
                        </Dialog.Close>
                        <Button variation="primary" isFullWidth onClick={handleStart}>
                            Start
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
            <Routes>
          {/*<Route path="/" element={<HomePage />} />*/}
          <Route path="/RunningForm/:projectID" element={<RunningForm />} />
          {/*<Route path="/FormsList" element={<CollectionForms />} />*/}
        </Routes>
        </>
    );
};

export default CollectionForms;
