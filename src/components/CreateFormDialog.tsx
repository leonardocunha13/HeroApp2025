import { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import { FaSave } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { GetClients, GetProjectsFromClientName, CreateForm } from "../actions/form";
import { Button } from '@aws-amplify/ui-react';
import { useNavigate } from "react-router-dom";

interface CreateFormDialogProps {
  onFormCreated: () => void;
}

const CreateFormDialog: React.FC<CreateFormDialogProps> = ({ onFormCreated }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

  // Local state to hold form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [projID, setProjID] = useState("");

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      const clientsData = await GetClients(); // Assuming this returns an array of client names
      setClients(clientsData.clientNames);
    };

    fetchClients(); // Fetch the clients when the component is mounted
  }, []);

  // Fetch projects when a client is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedClient) {
        const { projectNames } = await GetProjectsFromClientName(selectedClient);
        setProjects(projectNames); // Set the projects for the selected client
      } else {
        setProjects([]); // Clear projects if no client is selected
      }
    };

    fetchProjects();
  }, [selectedClient]); // Trigger when the selected client changes

  // Create form function that gets called on button click
  const handleCreateForm = async () => {
    try {
      if (!name || !description || !projID) {
        alert("Please fill in all fields.");
        return;
      }
  
      const formId = await CreateForm(name, description, projID);
      if (!formId) {
        throw new Error("Form ID not returned");
      }
  
      alert("Form created successfully with ID: " + formId);
      onFormCreated?.(); // Refresh the form list
      console.log("formId", formId);
      navigate("/form-builder", { state: formId });

    } catch (error) {
      console.error("Error creating form:", error);
      if (error instanceof Error) {
        alert("Error creating form: " + error.message); // Show error message in alert
      } else {
        alert("An unknown error occurred.");
      }
    }
  };
  

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="large" variation="primary" className="Button violet">
          <IoIosCreate /> Create Form
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Create New Form</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Add details to create your form
          </Dialog.Description>

          {/* Client Dropdown */}
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="Client" style={{ color: 'black' }}>
              Client
            </label>

            <select
              className="Input"
              id="client"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Select Client</option>
              {clients.map((client, index) => (
                <option key={index} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </fieldset>

          {/* Project Dropdown */}
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="ProjectName" style={{ color: 'black' }}>
              Project Name
            </label>

            <select
              className="Input"
              id="projectId"
              value={projID}
              onChange={(e) => setProjID(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((project, index) => (
                <option key={index} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </fieldset>

          {/* Name and Description fields */}
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="name" style={{ color: 'black' }}>
              Form Name
            </label>
            <input
              className="Input"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="desc" style={{ color: 'black' }}>
              Form Description
            </label>

            <input
              className="Input"
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </fieldset>

          <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <Button className="Button green" onClick={handleCreateForm}>
                <FaSave /> Create Form
              </Button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateFormDialog;