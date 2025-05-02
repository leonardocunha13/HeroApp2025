import { FormElement } from "./FormElements";
import { useDraggable } from "@dnd-kit/core";
import { Button, Text, Flex, useTheme } from "@aws-amplify/ui-react";  // Import Amplify UI components

function SidebarBtnElement({ formElement }: { formElement: FormElement }) {
  const { tokens } = useTheme(); // Use theme tokens from Amplify UI

  if (!formElement || !formElement.designerBtnElement) {
    console.error("SidebarBtnElement received an invalid formElement:", formElement);
    return null;
  }

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
      variation="link" // 'link' or any other style you need
      height="80px"      isFullWidth={true}
      borderRadius={tokens.radii.medium} // Use design tokens
      border={`1px solid ${tokens.colors.border.primary}`} // Use design tokens for border color
      backgroundColor={tokens.colors.background.primary} // Use design tokens
      color={tokens.colors.font.primary} // Use design tokens
      style={{ cursor: "grab" }} // Apply cursor style directly
      gap={tokens.space.xxxs} // Use design tokens
      className={draggable.isDragging ? 'ring-2 ring-primary' : ''}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Flex direction="row" alignItems="center" justifyContent="center">
        <Icon  />
        <Text fontSize={tokens.fontSizes.xs}>{label}</Text>
      </Flex>
    </Button>
  );
}

export function SidebarBtnElementDragOverlay({ formElement }: { formElement: FormElement }) {
  const { tokens } = useTheme(); // Use theme tokens from Amplify UI
  const { label, icon: Icon } = formElement.designerBtnElement;

  return (
    <Button
      variation="link"
      isFullWidth={false}

      borderRadius={tokens.radii.medium} // Use design tokens
      border={`1px solid ${tokens.colors.border.primary}`} // Use design tokens
      backgroundColor={tokens.colors.background.secondary} // Use design tokens
      color={tokens.colors.font.primary} // Use design tokens
      style={{ cursor: "grab" }} // Apply cursor style directly
      gap={tokens.space.xs} // Use design tokens
    >
      <Flex direction="column" alignItems="center" justifyContent="center">
        <Icon className="h-8 w-8 text-primary" />
        <Text fontSize={tokens.fontSizes.xs}>{label}</Text>
      </Flex>
    </Button>
  );
}

export default SidebarBtnElement;
