import React, { useState } from 'react';

interface DroppableCanvasProps {
  selectedField: string | null;
}

interface TableField {
  label: string;
  type: string;
}

const DroppableCanvas: React.FC<DroppableCanvasProps> = ({ selectedField }) => {
  const [fields, setFields] = useState<TableField[]>([]);

  const addField = () => {
    if (selectedField) {
      setFields([
        ...fields,
        { label: selectedField.replace(/-/g, ' ').toUpperCase(), type: selectedField },
      ]);
    }
  };

  return (
    <div className="droppable-canvas-modern">
      <button className="add-field-modern" onClick={addField}>
        Add Field to Table
      </button>

      <table className="fields-table">
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {fields.map((field, index) => (
              <td key={index}>
                <input type={field.type} placeholder={`Enter ${field.label.toLowerCase()}`} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DroppableCanvas;