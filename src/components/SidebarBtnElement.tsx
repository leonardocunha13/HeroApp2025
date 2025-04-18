import { FormElement } from "./FormElements";
import { Button } from "@aws-amplify/ui-react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "../lib/utils";

function SidebarBtnElement({ formElement }: { formElement: FormElement }) {
  const { label, icon: Icon } = formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });

  return (
    <Button
      ref={draggable.setNodeRef}
      style={{ border: "1px solid", borderColor: "currentColor" }}
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",
        draggable.isDragging && "ring-2 ring-primary",
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export function SidebarBtnElementDragOverlay({ formElement }: { formElement: FormElement }) {
  const { label, icon: Icon } = formElement.designerBtnElement;

  return (
    <Button className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab">
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export default SidebarBtnElement;
