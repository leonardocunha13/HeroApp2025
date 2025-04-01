import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import "./styles.css";

// JSON object containing the role options
const roles = {
  project1: "project1",
  project2: "project2",
  project3: "project3"
};

const CreateFormDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Button className="Button violet">Create Form</Button>
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
          <label className="Label" htmlFor="projectId">
            Role
          </label>
          <select className="Input" id="projectId" defaultValue="<Select project Id>">
            {Object.keys(roles).map((key) => (
              <option key={key} value={key}>
                {roles[key as keyof typeof roles]} {/* Type assertion here */}
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