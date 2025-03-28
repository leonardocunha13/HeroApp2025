import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableFieldProps {
  label: string;
  type: string;
  icon: string; // Include the icon property
}

const DraggableField: React.FC<DraggableFieldProps> = ({ label, type, icon }) => {
  const [, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { label, type },
  }));

  return (
    <div
      ref={drag}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        margin: '10px',
        backgroundColor: '#e0e0e0',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'grab',
        fontSize: '14px',
      }}
    >
      <span style={{ marginRight: '10px' }}>{icon}</span> {/* Render the icon */}
      {label}
    </div>
  );
};

export default DraggableField;