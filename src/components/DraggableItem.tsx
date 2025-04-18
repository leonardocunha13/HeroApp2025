// src/components/DraggableItem.tsx
import { useDraggable } from '@dnd-kit/core';
import { Card, Text } from '@aws-amplify/ui-react';

const DraggableItem = ({ id, label }: { id: string; label: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type: 'component', id },
  });

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      variation="outlined"
      padding="0.75rem"
      marginBottom="0.5rem"
      borderRadius="medium"
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        cursor: 'grab',
      }}
    >
      <Text>{label}</Text>
    </Card>
  );
};

export default DraggableItem;