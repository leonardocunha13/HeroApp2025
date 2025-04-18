// src/components/DropCanvas.tsx
import { useDroppable } from '@dnd-kit/core';
import { View } from '@aws-amplify/ui-react';

const DropCanvas = ({
  droppedComponents = [],
}: {
  droppedComponents: string[];
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'drop-canvas' });

  return (
    <View
      ref={setNodeRef}
      padding="2rem"
      width="100%"
      height="100vh"
      backgroundColor={isOver ? 'green' : 'background.primary'}
      style={{
        border: '2px dashed #ccc',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        position: 'relative', // Important for zIndex control
      }}
    >
      <h2>Drop components here</h2>
      <div style={{ marginTop: '1rem' }}>
        {droppedComponents.map((comp, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
            }}
          >
            <p>{comp}</p>
          </div>
        ))}
      </div>
    </View>
  );
};

export default DropCanvas;