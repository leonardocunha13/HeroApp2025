// src/components/fields/TableField.tsx

import {
    ElementsType,
    FormElement,
    FormElementInstance,
    SubmitFunction,
  } from "../FormElements";
  import { z } from "zod";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useEffect } from "react";
  import { MdTableChart } from "react-icons/md";
  import useDesigner from "../hooks/useDesigner";
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
  
  const type: ElementsType = "TableField";
  
  const extraAttributes = {
    rows: 2,
    columns: 2,
    label: "Table Field",
    required: false,
  };
  
  const propertiesSchema = z.object({
    rows: z.number().min(1).max(10),
    columns: z.number().min(1).max(10),
    label: z.string().min(1).max(50),
    required: z.boolean().optional(),
  });
  
  type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
  };
  
  export const TableFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
      id,
      type,
      extraAttributes,
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
    const { rows, columns, label } = element.extraAttributes;
  
    return (
      <div>
        <p className="font-medium mb-2">{label}</p>
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(columns)].map((_, col) => (
                <TableHead key={col}>Col {col + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(rows)].map((_, row) => (
              <TableRow key={row}>
                {[...Array(columns)].map((_, col) => (
                  <TableCell key={col}>Cell</TableCell>
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
    submitValue,
  }: {
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
  }) {
    const element = elementInstance as CustomInstance;
    const { rows, columns, label } = element.extraAttributes;
  
    return (
      <div>
        <p className="font-medium mb-2">{label}</p>
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(columns)].map((_, col) => (
                <TableHead key={col}>Col {col + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(rows)].map((_, row) => (
              <TableRow key={row}>
                {[...Array(columns)].map((_, col) => (
                  <TableCell key={col}>
                    <Input
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (submitValue) {
                          submitValue(`${element.id}-r${row}-c${col}`, value);
                        }
                      }}
                    />
                  </TableCell>
                ))}
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
  
    const form = useForm<propertiesFormSchemaType>({
      resolver: zodResolver(propertiesSchema),
      defaultValues: {
        ...element.extraAttributes,
      },
    });
  
    useEffect(() => {
      form.reset(element.extraAttributes);
    }, [element, form]);
  
    function applyChanges(values: propertiesFormSchemaType) {
        const { label, required } = values;
        updateElement(element.id, {
          ...element,
          extraAttributes: {
            label,
            rows: values.rows,
            columns: values.columns,
            required,
          },
        });
      }
  
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
        </form>
      </Form>
    );
  }
  
  
  