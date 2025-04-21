import {
  Collection,
  Card,
  Heading,
  Flex,
  Badge,
  Button,
  Text,
  Loader,
} from "@aws-amplify/ui-react";
import { GetFormsInformation, runForm } from "../actions/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

//import { Cross2Icon } from "@radix-ui/react-icons";

interface Form {
  id: string;
  name: string | null;
  description: string | null;
  published: boolean | null;
  content: string | null;
}

interface ProjectItem {
  clientName: string;
  projectName: string;
  projectID: string;
  forms: Form[];
}

interface FormInfo {
  id: string;
  title: string | null;
  description: string | null;
  projectName: string;
  clientName: string;
  projectID: string;
  badges: string[];
  published: boolean | null;
  content: string | null;
}

const CollectionForms = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState<FormInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormInfo | null>(null);
  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentTag, setEquipmentTag] = useState("");
  const [refresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData: ProjectItem[] = await GetFormsInformation();
        const formattedInfo: FormInfo[] = fetchedData
          .filter((project) => project.forms.length > 0)
          .flatMap((project) =>
            project.forms.map((form) => ({
              id: form.id,
              title: form.name,
              description: form.description,
              projectName: project.projectName,
              clientName: project.clientName,
              projectID: project.projectID,
              published: form.published,
              content: form.content,
              badges: [project.clientName, project.projectID],
            })),
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

  const handleStart = async () => {
    if (!equipmentName || !equipmentTag || !selectedForm) {
      console.error("Please fill in all the fields.");
      return;
    }

    if (!selectedForm.published) {
      alert("This form is not published and cannot be started.");
      return;
    }

    const { title, projectID } = selectedForm;

    if (!title || !projectID) {
      console.error("Title or Project ID is missing.");
      return;
    }

    // Call runForm and capture both success and createdTagID
    const { success, createdTagID, tagCreatedAt } = await runForm(
      title,
      projectID,
      equipmentName,
      equipmentTag,
    );

    if (success) {
      const formData = {
        form: selectedForm,
        equipmentName,
        equipmentTag,
        content: selectedForm.content,
        createdTagID, // Include the createdTagID if needed in the next screen
        tagCreatedAt,
      };

      navigate(`/RunningForm/${createdTagID}`, { state: formData });
      setIsDialogOpen(false);
    } else {
      console.error(
        "Form creation was not successful due to existing equipment tag.",
      );
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  function editForm(): void {
    if (!selectedForm) {
      console.error("No form selected for editing.");
      return;
    }

    // Ensure form ID is included in the state when navigating
    navigate(`/form-builder/${selectedForm.id}`, {
      state: { form: selectedForm, formID: selectedForm.id },
    });
  }

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
          templateColumns={{
            base: "1fr", // 1 column on small screens (phones)
            small: "1fr 1fr", // 2 columns on medium screens (tablets)
            medium: "1fr 1fr 1fr", // 3 columns on larger screens (desktops)
          }}
          gap="15px"
          position="relative" // Fixed position to the top
          isSearchable
          isPaginated
          itemsPerPage={6}
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
            return form.clientName
              .toLowerCase()
              .includes(keyword.toLowerCase());
          }}
        >
          {(item, index) => (
            <Card
              key={index}
              borderRadius="medium"
              width="15rem"
              height="11rem"
              variation="outlined"
              padding="medium"
              onClick={() => openDialog(item)}
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease", // Smooth transition for the border change
                overflow: "hidden", // Prevent text overflow if it doesn't fit
              }}
              onMouseEnter={(e) => {
                // Add outline on hover
                e.currentTarget.style.border = "2px solid #000"; // Outline color on hover
              }}
              onMouseLeave={(e) => {
                // Remove outline when mouse leaves
                e.currentTarget.style.border = "none";
              }}
            >
              <Heading
                level={5}
                paddingBottom="small"
                style={{ fontSize: "0.9rem" }}
              >
                {item.title}
              </Heading>

              <Text
                paddingBottom="small"
                fontWeight="bold"
                color="gray.60"
                style={{ fontSize: "0.75rem" }}
              >
                Project: {item.projectName}
              </Text>

              <Flex gap="small" paddingBottom="small">
                {item.badges.map((badge, i) => (
                  <Badge
                    key={i}
                    backgroundColor="yellow.40"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {badge}
                  </Badge>
                ))}
              </Flex>
              <Flex gap="small" paddingBottom="small">
                <Badge
                  style={{ fontSize: "0.7rem", color: "white" }}
                  backgroundColor={item.published ? "green" : "red"}
                >
                  {item.published ? "PUBLISHED" : "NOT PUBLISHED"}
                </Badge>
              </Flex>
            </Card>
          )}
        </Collection>
      )}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="text-xl font-bold mb-2">
            Enter Equipment Details
          </Dialog.Title>

          {selectedForm && (
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <Text fontSize="1rem" fontWeight="bold">
                Test Name:
              </Text>
              <Text>{selectedForm.title}</Text>

              <Text
                fontSize="1rem"
                fontWeight="bold"
                style={{ marginTop: "8px" }}
              >
                Client:
              </Text>
              <Text>{selectedForm.clientName}</Text>

              <Text
                fontSize="1rem"
                fontWeight="bold"
                style={{ marginTop: "8px" }}
              >
                Project Name:
              </Text>
              <Text>{selectedForm.projectName}</Text>

              <Text
                fontSize="1rem"
                fontWeight="bold"
                style={{ marginTop: "8px" }}
              >
                Project ID:
              </Text>
              <Text>{selectedForm.projectID}</Text>

              <Text
                fontSize="1rem"
                fontWeight="bold"
                style={{ marginTop: "8px" }}
              >
                Test Description:
              </Text>
              <Text
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedForm.description}
              </Text>
            </div>
          )}

          <Dialog.Description className="text-gray-600 mb-4">
            Please provide the equipment name and tag before proceeding.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text
                as="div"
                fontSize="1rem"
                marginBottom="1rem"
                fontWeight="bold"
              >
                Equipment Name
              </Text>
              <input
                type="text"
                placeholder="Enter Equipment Name"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </label>
            <label>
              <Text
                as="div"
                fontSize="1rem"
                marginBottom="1rem"
                fontWeight="bold"
              >
                Equipment Tag
              </Text>
              <input
                type="text"
                placeholder="Enter Equipment Tag"
                value={equipmentTag}
                onChange={(e) => setEquipmentTag(e.target.value)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </label>
          </Flex>
          <Flex
            gap="large"
            style={{
              marginTop: "1rem",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Dialog.Close asChild>
              <Button
                style={{ backgroundColor: "gray", padding: "10px" }}
                onClick={handleClose}
              >
                Close
              </Button>
            </Dialog.Close>
            <Button
              style={{ padding: "10px", backgroundColor: "white.40" }}
              onClick={editForm}
              disabled={selectedForm?.published === true}
            >
              Edit Form
            </Button>
            <Button
              style={{ padding: "10px", width: "100px" }}
              variation="primary"
              onClick={handleStart}
            >
              Start
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default CollectionForms;
