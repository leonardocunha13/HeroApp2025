"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef} from "react";
import useDesigner from "../hooks/useDesigner";

import {
  Form,
  FormLabel,
} from "../ui/form";
import { MdImage } from "react-icons/md";

import { Button } from "../ui/button"; // certifique-se de ter isso importado
import { Upload } from "lucide-react"; // ícone opcional, pode ser trocado


const type: ElementsType = "ImageField";

const extraAttributes = {
  imageUrl: "",
};

const propertiesSchema = z.object({
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

export const ImageFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    label: "Image Field",
  }),
  designerBtnElement: {
    icon: MdImage,
    label: "Image field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { imageUrl } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full items-start">
      <Label />
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="rounded-md border shadow max-h-48 w-auto object-contain"
        />
      ) : (
        <p className="text-sm text-muted-foreground italic">No image uploaded</p>
      )}
    </div>
  );
}


function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const imageUrl = element.extraAttributes.imageUrl;

  if (!imageUrl) return <p className="text-muted-foreground">No image selected</p>;

  return (
    <img
      src={imageUrl}
      alt="Uploaded"
      style={{
        height: element.height ? `${element.height}px` : "auto",
        width: "auto",
        maxWidth: "100%", 
        objectFit: "contain",
      }}
    />
  );
}


type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      imageUrl: element.extraAttributes.imageUrl,
    },
  });
  
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { imageUrl } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        imageUrl: imageUrl || "",
      },
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const base64 = reader.result as string;
      
      const img = new Image();
      img.onload = () => {
        const height = img.naturalHeight;
        console.log("altura", height);
        updateElement(element.id, {
          ...element,
          extraAttributes: {
            ...element.extraAttributes,
            imageUrl: base64,
          },
          height: height,
          
        });
      };
      img.src = base64;
    };
    
    reader.readAsDataURL(file);
  }
  
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }
  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-3"
      >
        <div className="space-y-1">
          <FormLabel>Upload from computer</FormLabel>
          <Button
            type="button"
            onClick={handleUploadClick}
            variant="outline"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

      </form>
    </Form>
  );
}
