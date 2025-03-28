import React from 'react';
import { useDrag } from 'react-dnd';

const formElements = [
  { label: 'Text Field', type: 'text', icon: '✏️' },
  { label: 'Password Field', type: 'password', icon: '🔑' },
  { label: 'Number Field', type: 'number', icon: '🔢' },
  { label: 'Radio Buttons', type: 'radio', icon: '🔘' },
  { label: 'Checkbox', type: 'checkbox', icon: '☑️' },
  { label: 'Dropdown', type: 'select', icon: '⬇️' },
];

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Form Elements</h2>
      <div className="form-elements">
        {formElements.map((element, index) => (
          <DraggableField key={index} label={element.label} type={element.type} icon={element.icon} />
        ))}
      </div>
    </div>
  );
};

const DraggableField: React.FC<{ label: string; type: string; icon: string }> = ({ label, type, icon }) => {
  const [, drag] = useDrag(() => ({
    type: 'field',
    item: { label, type },
  }));

  return (
    <div ref={drag} className="draggable-field">
      <span className="icon">{icon}</span>
      {label}
    </div>
  );
};

export default Sidebar;