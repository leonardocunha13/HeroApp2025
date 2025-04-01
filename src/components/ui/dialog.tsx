"use client";

import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";

// Your Dialog component implementation
const DialogDemo = () => (
  <Dialog.Root>
    {/* Trigger to open the dialog */}
    <Dialog.Trigger asChild>
      <button className="Button violet">Edit profile</button>
    </Dialog.Trigger>

    {/* Dialog Portal (to display modal content) */}
    <Dialog.Portal>
      {/* Dialog Overlay (Backdrop) */}
      <Dialog.Overlay className="DialogOverlay" />
      
      {/* Dialog Content */}
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Edit profile</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Make changes to your profile here. Click save when you're done.
        </Dialog.Description>

        {/* Input Fields */}
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="name">
            Name
          </label>
          <input className="Input" id="name" defaultValue="Pedro Duarte" />
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="username">
            Username
          </label>
          <input className="Input" id="username" defaultValue="@peduarte" />
        </fieldset>

        {/* Save Changes Button */}
        <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
          <Dialog.Close asChild>
            <button className="Button green">Save changes</button>
          </Dialog.Close>
        </div>

        {/* Close Button */}
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogDemo;
