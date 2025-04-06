import Input from "./input";

interface TableProps {
    headers: string[];
    data: string[][];
    onChange: (rowIndex: number, colIndex: number, value: string) => void;
  }
  
  const Table: React.FC<TableProps> = ({ headers, data, onChange }) => (
    <table className="table-auto w-full">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="p-2 text-left">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex} className="p-2">
                <Input
                  value={cell}
                  onChange={(e) => onChange(rowIndex, colIndex, e.target.value)}
                  placeholder="Cell value"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  export default Table;