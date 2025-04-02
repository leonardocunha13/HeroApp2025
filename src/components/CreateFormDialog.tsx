import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";

// JSON object containing the role options
const clients = {
  project1: "Client-1",
  project2: "Client-2",
  project3: "Client-3"
};

const projectId = {
  project1: "Project-1",
  project2: "Project-2",
  project3: "Project-3",
}

const CreateFormDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet">Create Form</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Create New Form</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Add details to create your form
        </Dialog.Description>
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

        {/* Dropdown populated using the JSON object */}
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="client">
            Cient
          </label>
          <select className="Input" id="client" defaultValue="<Select client>">
            {Object.keys(clients).map((key) => (
              <option key={key} value={key}>
                {clients[key as keyof typeof clients]} {/* Type assertion here */}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="projectId">
            ProjectId
          </label>
          <select className="Input" id="projectId" defaultValue="<Select project Id>">
            {Object.keys(projectId).map((key) => (
              <option key={key} value={key}>
                {projectId[key as keyof typeof projectId]} {/* Type assertion here */}
              </option>
            ))}
          </select>
        </fieldset>


        <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
          <Dialog.Close asChild>
            <button className="Button green">Save changes</button>
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

export default CreateFormDialog;