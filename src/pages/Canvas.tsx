import React from 'react';
import { useDrop } from 'react-dnd';

interface CanvasProps {
  fields: any[];
  onDrop: (item: any, position: { x: number; y: number }) => void;
}

const Canvas: React.FC<CanvasProps> = ({ fields, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: 'field',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasPosition = {
        x: offset?.x || 0,
        y: offset?.y || 0,
      };
      onDrop(item, canvasPosition);
    },
  }));

  return (
    <div ref={drop} className="canvas">
      {fields.map((field, index) => (
        <div
          key={index}
          className="field"
          style={{ top: `${field.position.y}px`, left: `${field.position.x}px`, position: 'absolute' }}
        >
          <input type={field.type} placeholder={field.label} />
        </div>
      ))}
    </div>
  );
};

export default Canvas;
