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
      <DialogContent className="h-screen max-h-screen max-w-full flex items-center justify-center p-0">
        <div className="w-[1000px] h-[90vh] flex flex-col overflow-y-auto rounded-2xl bg-background p-8">
          <SubmissionRenderer elements={elements} responses={responses} />
        </div>
      </DialogContent>
    </Dialog>
  );
  
}
