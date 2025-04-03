import { Collection, Card, Heading, Flex, Badge, Divider, Button, Text, Loader } from "@aws-amplify/ui-react";
import { GetFormsInformation } from "../actions/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

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

export const CollectionForms = () => {
    const navigate = useNavigate();
    const [info, setInfo] = useState<FormInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open state
    const [selectedForm, setSelectedForm] = useState<FormInfo | null>(null); // Selected form data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData: ProjectItem[] = await GetFormsInformation();
                {/*Filter to return only the projects that contains the forms*/ }
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
    }, []);

    const openDialog = (form: FormInfo) => {
        setSelectedForm(form); // Set the selected form
        setIsDialogOpen(true); // Open the dialog
    };

    const closeDialog = () => {
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
                        <Card
                            key={index}
                            borderRadius="medium"
                            width="20rem"
                            variation="outlined"
                            padding="medium"
                        >
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

                            <Divider />
                            {/*Need to include the function of this button, related to each form*/}
                            <Button
                                variation="primary"
                                isFullWidth
                                onClick={() => openDialog(item)}
                            >
                                Run Form
                            </Button>
                        </Card>
                    )}
                </Collection>
            )}
            {/* Dialog for viewing form details */}
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Title  color="black">Form Details</Dialog.Title>
                        <Dialog.Description className="DialogDescription">
                            View details for the selected form
                        </Dialog.Description>

                        {selectedForm && (
                            <div>
                                <p><strong>Form Title:</strong> {selectedForm.title}</p>
                                <p><strong>Description:</strong> {selectedForm.description}</p>
                                <p><strong>Client:</strong> {selectedForm.clientName}</p>
                                <p><strong>Project:</strong> {selectedForm.projectName}</p>
                            </div>
                        )}

                        <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
                            <Dialog.Close asChild>
                                <Button variation="primary" onClick={closeDialog}>Close</Button>

                            </Dialog.Close>
                        </div>
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={closeDialog}>
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

export default CollectionForms;
