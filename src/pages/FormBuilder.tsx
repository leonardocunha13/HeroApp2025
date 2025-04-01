import React, { useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import './Styles/FormBuilder.css';

const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<any[]>([]);

  const handleDrop = (item: any, position: { x: number; y: number }) => {
    setFields([...fields, { ...item, position }]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="form-builder">
   
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
