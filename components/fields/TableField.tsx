// src/components/fields/TableField.tsx
"use client";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { MdTableChart } from "react-icons/md";
import useDesigner from "../hooks/useDesigner";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";
import { Divider } from "@aws-amplify/ui-react";
import { Button } from "../ui/button";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const type: ElementsType = "TableField";

const extraAttributes = {
  rows: 2,
  columns: 2,
  label: "Table Field",
  required: false,
  data: [["", ""], ["", ""]],
  columnHeaders: ["Col 1", "Col 2"],
};

const propertiesSchema = z.object({
  rows: z.number().min(1).max(500),
  columns: z.number().min(1).max(10),
  label: z.string().min(1).max(50),
  required: z.boolean().optional(),
  data: z.array(z.array(z.string())).optional(),
  columnHeaders: z.array(z.string()).optional(),
});

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const TableFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    label: extraAttributes.label,
    extraAttributes,
    height: 0, // Initialize height with a default value
  }),
  designerBtnElement: {
    icon: MdTableChart,
    label: "Table Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    formElement: FormElementInstance,
    currentValue: string,
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue === "true";
    }
    return true;
  },
};

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { rows, columns, label, data = [], columnHeaders = [] } = element.extraAttributes;
  const { updateElement } = useDesigner();

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      const newHeight = containerRef.current.offsetHeight;
      if (element.height !== newHeight) {
        updateElement(element.id, {
          ...element,
          height: newHeight,
        });
      }
    }
  }, [rows, columns, data]);

  return (
    <div ref={containerRef}>
      <p className="font-medium mb-2">{label}</p>
      <Table>
        <TableHeader>
          <TableRow>
            {[...Array(columns)].map((_, col) => (
              <TableHead key={col}
                style={{
                  maxWidth: "200px",
                  minWidth: "50px",
                  width: "auto",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}>
                {columnHeaders[col] || `Col ${col + 1}`}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(rows)].map((_, row) => (
            <TableRow key={row}>
              {[...Array(columns)].map((_, col) => (
                <TableCell key={col}
                  style={{
                    maxWidth: "200px",
                    minWidth: "50px",
                    width: "auto",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    verticalAlign: "top",
                  }}>
                  <div
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {data?.[row]?.[col] || " "}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function FormComponent({
  elementInstance,
  defaultValue,
  readOnly,
}: {
  elementInstance: FormElementInstance;
  defaultValue?: any;
  isInvalid?: boolean;
  submitValue?: SubmitFunction;
  readOnly?: boolean;
}) {
  const designer = useDesigner();

  const element = elementInstance as CustomInstance;
  const { rows, columns, label, columnHeaders = [] } = element.extraAttributes;
  const initialData: string[][] = defaultValue || element.extraAttributes.data || [];

  const [editableData, setEditableData] = useState<string[][]>(initialData);

  const [editableCells] = useState(() =>
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: columns }, (_, col) => !initialData[row]?.[col])
    )
  );

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = [...editableData];
    if (!newData[row]) newData[row] = [];
    newData[row][col] = value;
    setEditableData(newData);
    if (!readOnly) {
      designer.updateElement(element.id, {
        ...element,
        extraAttributes: {
          ...element.extraAttributes,
          data: newData,
        },
      });
    }
  };

  const handleCheckboxChange = (row: number, col: number, checked: boolean) => {
    const newData = [...editableData];
    if (!newData[row]) newData[row] = [];
    newData[row][col] = checked ? "[checkbox:true]" : "[checkbox:false]";
    setEditableData(newData);
    if (!readOnly) {
      designer.updateElement(element.id, {
        ...element,
        extraAttributes: {
          ...element.extraAttributes,
          data: newData,
        },
      });
    }
  };

  return (
    <div>
      <p className="font-medium mb-2">{label}</p>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }, (_, col) => (
              <TableHead key={col}>{columnHeaders[col] || `Col ${col + 1}`}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, row) => (
            <TableRow key={row}>
              {Array.from({ length: columns }, (_, col) => {
                const cellValue = editableData[row]?.[col] || "";
                const isCheckbox = cellValue.startsWith("[checkbox");
                const checked = cellValue === "[checkbox:true]";
                const isSelect = cellValue.startsWith("[select");
                const isNumber = cellValue.startsWith("[number");
                const numberValue = isNumber ? cellValue.match(/^\[number:(.*?)\]$/)?.[1] ?? "" : "";
                const isDate = cellValue.startsWith("[date:");
                const dateValue = isDate ? cellValue.match(/^\[date:(.*?)\]$/)?.[1] ?? "" : "";

                let isSelectValue = "";
                let isSelectOptionsArray: string[] = [];

                if (isSelect) {
                  try {
                    const match = cellValue.match(/^\[select:"(.*?)":(\[.*\])\]$/);
                    if (match) {
                      isSelectValue = match[1];
                      isSelectOptionsArray = JSON.parse(match[2]);
                    } else {
                      console.warn("Select format didn't match:", cellValue);
                    }
                  } catch (error) {
                    console.warn("Failed to parse select options from cellValue:", cellValue, error);
                    isSelectValue = "";
                    isSelectOptionsArray = [];
                  }
                }

                let isSelectValueArray: string[] = [];
                try {
                  isSelectValueArray = isSelectValue ? JSON.parse(isSelectValue) : [];
                } catch (error) {
                  console.warn("Failed to parse isSelectValue:", isSelectValue);
                  isSelectValueArray = [];
                }


                return (
                  <TableCell key={col} className="justify-center items-center">
                    {isCheckbox ? (
                      <input
                        type="checkbox"
                        className="h-4 w-4 flex justify-center items-center"
                        checked={checked}
                        onChange={(e) => handleCheckboxChange(row, col, e.target.checked)}
                        disabled={readOnly}
                      />
                    ) : isSelect ? (
                      <select
                        className="border rounded px-2 py-1"
                        style={{ width: "100%" }}
                        value={isSelectValue}
                        onChange={(e) => {
                          const newValue = `[select:"${e.target.value}":${JSON.stringify(isSelectOptionsArray)}]`;
                          handleCellChange(row, col, newValue);
                        }}
                        disabled={readOnly}
                      >
                        {isSelectOptionsArray.map((option: string, index: number) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : isNumber ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1"
                        value={numberValue}
                        onChange={(e) =>
                          handleCellChange(row, col, `[number:${e.target.value}]`)
                        }
                        disabled={readOnly}
                      />
                    ) : isDate ? (
                      <ReactDatePicker
                        className="border rounded px-2 py-1"
                        selected={dateValue ? new Date(dateValue) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            handleCellChange(row, col, `[date:${date.toISOString().split("T")[0]}]`);
                          }
                        }}
                        disabled={readOnly}
                        dateFormat="yyyy-MM-dd"
                      />

                    ) : !readOnly && editableCells[row]?.[col] ? (
                      <Input
                        value={cellValue}
                        onChange={(e) => handleCellChange(row, col, e.target.value)}
                      />
                    ) : (
                      // Fallback for readonly display
                      <div>{cellValue}</div>
                    )}
                  </TableCell>




                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}




type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      ...element.extraAttributes,
    },
  });

  const [data, setData] = useState<string[][]>(element.extraAttributes.data);

  useEffect(() => {
    form.reset(element.extraAttributes);
    setData(element.extraAttributes.data);

    const existingHeaders = element.extraAttributes.columnHeaders;
    const numCols = element.extraAttributes.columns;

    if (existingHeaders && existingHeaders.length === numCols) {
      setColumnHeaders(existingHeaders);
    } else {
      const newHeaders = [];
      for (let i = 0; i < numCols; i++) {
        newHeaders.push(existingHeaders?.[i] || `Col ${i + 1}`);
      }
      setColumnHeaders(newHeaders);
    }
  }, [element.extraAttributes.columns, element.extraAttributes.columnHeaders]);

  const watchRows = form.watch("rows");
  const watchColumns = form.watch("columns");

  useEffect(() => {
    setData((prevData) => {
      const newData = Array.from({ length: watchRows }, (_, row) =>
        Array.from({ length: watchColumns }, (_, col) => prevData?.[row]?.[col] || "")
      );
      return newData;
    });
  }, [watchRows, watchColumns]);

  function handleCellChange(row: number, col: number, value: string) {
    const newData = [...data];
    newData[row][col] = value;
    setData(newData);
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...element.extraAttributes,
        data: newData,
      },
    });
  }

  const [columnHeaders, setColumnHeaders] = useState<string[]>(
    element.extraAttributes.columnHeaders || Array.from({ length: watchColumns }, (_, i) => `Col ${i + 1}`)
  );

  useEffect(() => {
    setColumnHeaders((prev) => {
      const newHeaders = Array.from({ length: watchColumns }, (_, i) => prev?.[i] || `Col ${i + 1}`);
      return newHeaders;
    });
  }, [watchColumns]);

  function handleHeaderChange(index: number, value: string) {
    const updatedHeaders = [...columnHeaders];
    updatedHeaders[index] = value;
    setColumnHeaders(updatedHeaders);

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...element.extraAttributes,
        data,
        columnHeaders: updatedHeaders,
      },
    });
  }

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, required } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        rows: values.rows,
        columns: values.columns,
        required,
        data,
        columnHeaders,
      },
    });
  }
  function handleImportClick() {
    fileInputRef.current?.click();
  }
  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

      if (parsedData.length === 0) return;

      const headers = parsedData[0].map((val) => (val ? String(val) : ""));
      const rows = parsedData.slice(1).map((row) =>
        Array.from({ length: headers.length }, (_, i) => row[i] ? String(row[i]) : "")
      );

      setColumnHeaders(headers);
      setData(rows);

      form.setValue("rows", rows.length);
      form.setValue("columns", headers.length);

      updateElement(element.id, {
        ...element,
        extraAttributes: {
          ...element.extraAttributes,
          rows: rows.length,
          columns: headers.length,
          data: rows,
          columnHeaders: headers,
        },
      });
    };
  }, [form, element, updateElement]);

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-3">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormDescription>Displayed above the table.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rows</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="columns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Columns</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>Marks the table field as required.</FormDescription>
              </div>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Divider orientation="horizontal" size="small" color="gray" marginTop="1rem" marginBottom="1rem" />
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <FormLabel>Table Content</FormLabel>
            <FormDescription> Use <code>[checkbox]</code> as the cell value to display a checkbox.</FormDescription>
          </div>
          <Button type="button" onClick={handleImportClick}>
            Import Excel
          </Button>
          <input
            type="file"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            ref={fileInputRef}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(watchColumns)].map((_, col) => (
                <TableHead key={col}>
                  <Input
                    value={columnHeaders[col] || ""}
                    onChange={(e) => handleHeaderChange(col, e.target.value)}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(watchRows)].map((_, row) => (
              <TableRow key={row}>
                {[...Array(watchColumns)].map((_, col) => (
                  <TableCell key={col}>
                    <Input
                      value={data?.[row]?.[col] || ""}
                      onChange={(e) => handleCellChange(row, col, e.target.value)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </Form>
  );
}


