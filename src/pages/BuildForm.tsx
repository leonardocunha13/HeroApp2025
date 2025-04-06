import React, { useState } from 'react';
import { DndContext, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { CSS } from '@dnd-kit/utilities';

// Define the structure of form components
interface FormComponent {
  id: string;
  type: string;
  content?: string;
  options?: string[];
  columns?: number;
  rows?: number;
  tableData?: (string | FormComponent)[][]; // Store components inside cells
}

// A simple editable component renderer
const ComponentRenderer = ({
  component,
  updateComponent,
}: {
  component: FormComponent;
  updateComponent: (id: string, data: Partial<FormComponent>) => void;
}) => {
  switch (component.type) {
    case 'text':
      return (
        <div className="flex flex-col">
          <input
            className="p-3 border rounded-md w-full"
            defaultValue={component.content}
            onBlur={(e) => updateComponent(component.id, { content: e.target.value })}
            placeholder="Enter text"
          />
          <label className="text-sm mt-2">Text Field</label>
        </div>
      );
    case 'select':
      return (
        <div className="flex flex-col">
          <select
            className="p-3 border rounded-md w-full"
            defaultValue={component.options?.[0]}
            onChange={(e) => {
              updateComponent(component.id, { options: [e.target.value] });
            }}
          >
            {component.options?.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <label className="text-sm mt-2">Select Field</label>
        </div>
      );
    case 'date':
      return (
        <div className="flex flex-col">
          <input
            type="date"
            className="p-3 border rounded-md w-full"
            onBlur={(e) => updateComponent(component.id, { content: e.target.value })}
          />
          <label className="text-sm mt-2">Date Picker</label>
        </div>
      );
    case 'checkbox':
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            onChange={(e) => updateComponent(component.id, { content: e.target.checked ? 'checked' : 'unchecked' })}
          />
          <label className="text-sm ml-2">Checkbox</label>
        </div>
      );
    case 'divider':
      return <hr className="my-6 border-t border-gray-400" />;
    case 'table':
      return (
        <div className="overflow-auto">
          <div className="flex gap-4 mb-4">
            <div>
              <span className="text-sm">Columns</span>
              <input
                type="number"
                min={1}
                className="p-2 border rounded w-24"
                value={component.columns || 1}
                onChange={(e) => updateComponent(component.id, { columns: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <span className="text-sm">Rows</span>
              <input
                type="number"
                min={1}
                className="p-2 border rounded w-24"
                value={component.rows || 1}
                onChange={(e) => updateComponent(component.id, { rows: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <table className="w-full border border-gray-400">
            <tbody>
              {component.tableData?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border p-2">
                      <TableCell
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        cell={cell}
                        component={component}
                        updateComponent={updateComponent}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};

// Table cell component where you can drag/drop components into each cell
const TableCell = ({
  rowIndex,
  colIndex,
  cell,
  component,
  updateComponent,
}: any) => {
  const { setNodeRef, isDragging } = useDraggable({
    id: `${component.id}-${rowIndex}-${colIndex}`,
  });

  const { setNodeRef: droppableRef } = useDroppable({
    id: `${component.id}-${rowIndex}-${colIndex}-droppable`,
  });

  const handleCellDrop = (event: any) => {
    const { active } = event;
    const newTableData = [...(component.tableData || [])];
    newTableData[rowIndex][colIndex] = { id: active.id, type: 'text' };
    updateComponent(component.id, { tableData: newTableData });
  };

  return (
    <div
      ref={droppableRef}
      className={`p-2 border-dashed border-2 ${isDragging ? 'bg-gray-200' : ''}`}
      onDrop={handleCellDrop}
    >
      {cell && typeof cell !== 'string' ? (
        <div ref={setNodeRef}>
          <ComponentRenderer component={cell} updateComponent={updateComponent} />
        </div>
      ) : (
        <div className="text-center text-gray-500">Drag component here</div>
      )}
    </div>
  );
};

// Main FormBuilder component to manage form state and logic
const FormBuilder = () => {
  const [components, setComponents] = useState<FormComponent[]>([]);

  const addComponent = (type: string) => {
    const newComponent: FormComponent = {
      id: uuidv4(),
      type,
      ...(type === 'select' && { options: ['Option 1', 'Option 2'] }),
      ...(type === 'table' && {
        columns: 2,
        rows: 2,
        tableData: Array(2).fill(Array(2).fill('')),
      }),
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  const updateComponent = (id: string, data: Partial<FormComponent>) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  return (
    <div className="p-8 space-y-6 dark:bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🛠️ Dynamic Form Builder</h1>
      <div className="flex gap-3 flex-wrap mb-6">
        {['text', 'select', 'date', 'checkbox', 'divider', 'table'].map((type) => (
          <button
            key={type}
            onClick={() => addComponent(type)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition"
          >
            ➕ Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <DndContext collisionDetection={closestCenter}>
        <div className="space-y-4">
          {components.map((component) => (
            <div key={component.id} className="p-4 border border-gray-500 rounded-md">
              <ComponentRenderer component={component} updateComponent={updateComponent} />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default FormBuilder;