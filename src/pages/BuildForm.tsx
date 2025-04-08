import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelFileEditor = () => {
  const [excelData, setExcelData] = useState<any[][]>([]); // Holds the parsed Excel data
  const [mergedCells, setMergedCells] = useState<any[]>([]); // Holds merged cells data

  // Function to handle file upload and parse Excel template
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const abuf = e.target.result;
      const workbook = XLSX.read(abuf, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      const merges = worksheet['!merges'] || []; // Get merged cells

      setExcelData(jsonData); // Set the Excel data in state
      setMergedCells(merges); // Set the merged cells in state
    };
    reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
  };

  // Function to handle cell edits
  const handleCellEdit = (rowIndex: number, colIndex: number, newValue: string) => {
    const updatedData = [...excelData];
    updatedData[rowIndex][colIndex] = newValue; // Update the cell value
    setExcelData(updatedData); // Update the state with the new data
  };

  // Function to save the edited Excel file
  const saveEditedFile = () => {
    const ws = XLSX.utils.aoa_to_sheet(excelData); // Convert the 2D array back to a sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'modified_template.xlsx'); // Download the modified file
  };

  return (
    <div>
      <h1>Excel Template Editor</h1>

      {/* File input for uploading Excel file */}
      <input type="file" accept=".xlsx" onChange={(e) => handleFileUpload(e.target.files![0])} />

      {/* Table to display the Excel data */}
      {excelData.length > 0 && (
        <div>
          <button onClick={saveEditedFile}>Save Edited Template</button>
          <table border={1}>
            <thead>
              <tr>
                {excelData[0].map((header: string, index: number) => (
                  <th key={index}>{header}</th> // Display the headers (first row)
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((row: any[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: any, colIndex: number) => {
                    const merged = mergedCells.find(
                      (merge) =>
                        (merge.s.r === rowIndex && merge.s.c === colIndex) ||
                        (merge.e.r === rowIndex && merge.e.c === colIndex)
                    );

                    return (
                      <td
                        key={colIndex}
                        rowSpan={merged ? merged.e.r - merged.s.r + 1 : 1}
                        colSpan={merged ? merged.e.c - merged.s.c + 1 : 1}
                        style={{ textAlign: 'center' }}
                      >
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleCellEdit(rowIndex + 1, colIndex, e.target.value)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelFileEditor;
