"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "./ui/dialog";
import SubmissionRenderer from "../components/submissionRenderer";



interface ViewSubmissionClientProps {
  elements: any[];
  responses: Record<string, any>;
}

export default function ViewSubmissionClient({ elements, responses }: ViewSubmissionClientProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="h-screen max-h-screen justify-center max-w-full flex items-center  p-0">
        <div className="w-full h-full flex flex-col justify-center overflow-y-auto rounded-2xl bg-background p-8">
          <SubmissionRenderer elements={elements} responses={responses} />
        </div>
        {/*<div className="mt-4">
           Render PDFRenderer component here with the form data 
          <PDFRenderer pdfUrl="/Template.pdf" formData={elements} />
        </div>*/}
      </DialogContent>

    </Dialog>
  );

}
