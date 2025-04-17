import React, { useState } from 'react';

interface TableProps {
  rows: number;
  columns: number;
  renderCell?: (rowIndex: number, colIndex: number) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ rows, columns, renderCell }) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Handles the click event for a table cell and updates the selected cell state
  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor:
                      selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                        ? '#f0f8ff'
                        : 'transparent',
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {renderCell ? renderCell(rowIndex, colIndex) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;