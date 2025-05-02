import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PreviewDialogBtn from "../../components/PreviewDialogBtn";
import Designer from "../../components/Designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "../../components/DragOverlayWrapper";
import useDesigner from "../../components/hooks/useDesigner";
import { ImSpinner2 } from "react-icons/im";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "../../components/ui/use-toast";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { GetFormById } from "../../actions/form";
import type { Schema } from "../../amplify/data/resource";
import { Flex, Text } from '@aws-amplify/ui-react';

type FormType = Schema["Form"]["type"];

function FormBuilder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setElements, setSelectedElement } = useDesigner();

  const [form, setForm] = useState<FormType | null>(null);
  const [isReady, setIsReady] = useState(false);

  const formID = location.state?.formId
  const formName = location.state?.name || location.state?.form?.title;
  const formClient = location.state?.client || location.state?.form?.clientName;
  const formProject = location.state?.projID || location.state?.form?.projectName;
  const formProjectID = location.state?.projectID || location.state?.form?.projectID;

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 300, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (!formID) {
      toast({
        title: "Missing form ID",
        description: "No form ID was provided in the navigation state.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const loadForm = async () => {
      try {
        const fetchedForm = await GetFormById(formID);
        if (!fetchedForm) throw new Error("Form not found");

        setForm({
          ...fetchedForm,
          FormSubmissions: fetchedForm.form?.FormSubmissions || null,
          projects: fetchedForm.form?.projects || [],
          equipmentTAGs: fetchedForm.form?.equipmentTAGs || [],
          id: fetchedForm.form?.id || "",
          updatedAt: fetchedForm.form?.updatedAt || "",
        });

        const elements = JSON.parse(fetchedForm.form?.content ?? "[]");
        setElements(elements);
        setSelectedElement(null);

        setTimeout(() => setIsReady(true), 300);
      } catch (err) {
        console.error("Failed to load form:", err);
        toast({
          title: "Error loading form",
          description: "The form content is invalid, missing, or unauthorized.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    loadForm();
  }, [formID, setElements, setSelectedElement, navigate]);

  if (!isReady || !form) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ImSpinner2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/submit/${form.shareURL}`;

  if (form.published) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="max-w-md">
          <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
            🎊🎊 Form Published 🎊🎊
          </h1>
          <h2 className="text-2xl">Share this form</h2>
          <h3 className="text-xl text-muted-foreground border-b pb-10">
            Anyone with the link can view and submit the form
          </h3>
          <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
            <Input className="w-full" readOnly value={shareUrl} />
            <Button
              className="mt-2 w-full"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast({
                  title: "Copied!",
                  description: "Link copied to clipboard",
                });
              }}
            >
              Copy link
            </Button>
          </div>
          <div className="flex justify-between">
            <Button variant={"link"} onClick={() => navigate("/")}>
              <BsArrowLeft className="mr-1" />
              Go back home
            </Button>
            <Button
              variant={"link"}
              onClick={() => navigate(`/forms/${form.id}`)}
            >
              Form details
              <BsArrowRight className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors}>
      {/* Action Buttons */}
        <Flex justifyContent="space-between" alignItems="center" marginTop="1rem">
          <Flex gap="0.75rem" alignItems="center">
            <PreviewDialogBtn />
            {!form.published && <Button>Publish</Button>}
          </Flex>
        </Flex>
      {/* Form Info Section */}
      <Flex direction="column" padding="1.5rem" gap="0.5rem" width="100%">
        <Flex
          direction="GR"
          width="100%"
          border="1px solid #ccc"
          borderRadius="8px"
          overflow="auto"
          fontSize={"0.875rem"}
        >
          {[
            {
              label: "Client",
              value: formClient,
            },
            {
              label: "Project",
              value: formProject,
              extraLabel: "Project ID",
              extraValue: formProjectID,
            },
            {
              label: "Equipment Name",
              value: "N/A",
              extraLabel: "Equipment Tag",
              extraValue: "N/A",
            },
            {
              label: "Document Name",
              value: formName,
            },
          ].map((item, index) => (
            <Flex
              key={index}
              direction="row"
              style={{ borderTop: index !== 0 ? "1px solid #ccc" : "none", borderBottom: "1px solid #ccc" }}
              wrap ="wrap"
            >
              <Flex
                width="10%"
                padding="0.75rem"
                backgroundColor="#f7f7f7"
                style = {{borderRight: "1px solid #ccc"}}
              >
                <Text fontWeight="bold">{item.label}</Text>
              </Flex>
              <Flex
                width={item.extraLabel ? "30%" : "80%"}
                padding="0.75rem"
                style={{
                  borderRight: item.extraLabel ? "1px solid #ccc" : "none", // Use 'none' instead of 'undefined'
                }}
              >
                <Text style={{ wordWrap: "break-word" }}>{item.value}</Text>
              </Flex>
              {item.extraLabel && (
                <>
                  <Flex
                    width="20%"
                    padding="0.75rem"
                    backgroundColor="#f7f7f7"
                    style = {{borderRight:"1px solid #ccc"}}
                  >
                    <Text fontWeight="bold">{item.extraLabel}</Text>
                  </Flex>
                  <Flex width="10%" padding="0.75rem">
                    <Text style={{ wordWrap: "break-word" }}>
                      {item.extraValue}
                    </Text>
                  </Flex>
                </>
              )}
            </Flex>
          ))}
        </Flex>

        

        {/* Designer Canvas */}
        <Designer />
      </Flex>

      <DragOverlayWrapper />
    </DndContext>

  );
}

export default FormBuilder;
