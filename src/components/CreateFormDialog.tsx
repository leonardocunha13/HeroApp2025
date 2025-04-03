import { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { Cross2Icon} from "@radix-ui/react-icons";
import { FaSave } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { GetClients, GetProjects } from "../actions/form";
import { Button } from '@aws-amplify/ui-react';


const CreateFormDialog = () => {
  // State for clients (array of strings) and projects (array of strings)
  const [clients, setClients] = useState<string[]>([]); 
  const [projectIDs, setProjectIDs] = useState<string[]>([]);
  const [projectNames, setProjectNames] = useState<string[]>([]);

  // Fetch clients and projects on component mount
  useEffect(() => {
    const fetchData = async () => {
      const clientsData = await GetClients(); // Assuming this returns an array of strings
      setClients(clientsData.clientNames); // Set clients state to the fetched data
      
      const { projectIDs, projectNames } = await GetProjects(); // Assuming this returns an object
      setProjectIDs(projectIDs); // Set the project IDs state
      setProjectNames(projectNames); // Set the project names state
    };

    fetchData(); // Call the function to fetch data
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        
        <Button size="large" variation="primary" className="Button violet" ><IoIosCreate />Create Form</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Create New Form</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Add details to create your form
          </Dialog.Description>
          
          {/* Name and Description fields */}
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="name">
              Name
            </label>
            <input className="Input" id="name" defaultValue="" />
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="desc">
              Description
            </label>
            <input className="Input" id="desc" defaultValue="" />
          </fieldset>

          {/* Dropdown populated using the fetched clients data */}
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="client">
              Client
            </label>
            <select className="Input" id="client" defaultValue="<Select client>">
              {clients.map((client, index) => (
                <option key={index} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </fieldset>

          {/* Dropdown populated using the fetched projects data */}
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="projectId">
              Project ID
            </label>
            <select className="Input" id="projectId" defaultValue="<Select project Id>">
              {projectIDs.map((id, index) => (
                <option key={id} value={id}>
                  {projectNames[index]} {/* Display the project name */}
                </option>
              ))}
            </select>
          </fieldset>

          <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <Button className="Button green"><FaSave />Save changes</Button>
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
