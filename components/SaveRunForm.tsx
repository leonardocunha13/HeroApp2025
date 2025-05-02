"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { View, Heading, Text, Alert, Flex, TextField } from "@aws-amplify/ui-react";
import { SaveFormAfterTest } from "../actions/form";
import { useRouter } from "next/navigation";

function SaveRunForm({ formID, tagID }: { formID: string; tagID: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [content, setContent] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setContent(""); // reset state
  };

  if (!mounted) {
    return null;
  }

  const handleSaveForm = async () => {
    const updated = await SaveFormAfterTest(formID, tagID, content);

    if (updated) {
      setSuccess("Form saved successfully.");
      setError(null);
      handleDialogClose();
      // Optional: navigate or refresh if needed
      router.refresh();
    } else {
      setError("Failed to save the form. Try again.");
      setSuccess(null);
    }
  };

  return (
    <>
      <Button
        className="w-[200px]"
        onClick={() => setIsDialogOpen(true)}
      >
        Save Form
      </Button>

      {isDialogOpen && (
        <View
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          backgroundColor="rgba(0,0,0,0.5)"
          display="flex"
          style={{
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <View
            ref={dialogRef}
            backgroundColor="white"
            padding="2rem"
            borderRadius="medium"
            width="90%"
            maxWidth="600px"
            boxShadow="0 4px 12px rgba(0,0,0,0.2)"
          >
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="1rem"
            >
              <Heading level={3}>Save Form Content</Heading>
              <Button className="link-button" onClick={handleDialogClose}>
                ✕
              </Button>
            </Flex>

            <Text marginBottom="1rem">Add content to save your form</Text>

            {error && (
              <Alert variation="error" isDismissible>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variation="success" isDismissible>
                {success}
              </Alert>
            )}

            <TextField
              label="Form Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter form content"
              row={4}
            />

            <Flex justifyContent="flex-end" marginTop="1rem">
              <Button
                className="w-[200px]"
                onClick={handleSaveForm}
              >
                Save
              </Button>
            </Flex>
          </View>
        </View>
      )}
    </>
  );
}

export default SaveRunForm;
