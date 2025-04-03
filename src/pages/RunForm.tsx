import { Collection, Card, Heading, Flex, Badge, Divider, Button, Text } from "@aws-amplify/ui-react";
import { GetFormsInformation } from "../actions/form";
import { useEffect, useState } from "react";

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
    const [info, setInfo] = useState<FormInfo[]>([]);

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
            }
        };
        fetchData();
    }, []);

    return (
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
                    <Button variation="primary" isFullWidth>
                        Run Form
                    </Button>
                </Card>
            )}
        </Collection>
    );
};

export default CollectionForms;
