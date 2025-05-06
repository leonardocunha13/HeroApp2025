import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FormElementInstance, FormElements } from "./FormElements";
import { Button } from "./ui/button";

interface Props {
  elements: FormElementInstance[];
  responses: { [key: string]: any };
}

export default function SubmissionRenderer({ elements, responses }: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const generatePDF = async () => {
    if (!contentRef.current) return;

    const originalClass = contentRef.current.className;
    contentRef.current.className = originalClass + " max-w-[1000px] mx-auto";

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const element = contentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    contentRef.current.className = originalClass;

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgHeightMM = canvas.height * 0.264583;
    const imgWidthMM = canvas.width * 0.264583;
    const ratio = Math.min(pdfWidth / imgWidthMM, 1);
    const adjustedWidth = imgWidthMM * ratio;
    const adjustedHeight = imgHeightMM * ratio;

    let position = 0;

    while (position < adjustedHeight) {
      const canvasPage = document.createElement("canvas");
      canvasPage.width = canvas.width;
      canvasPage.height = (pdfHeight / 0.264583) / ratio;

      const ctx = canvasPage.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        canvas,
        0,
        (position / 0.264583) / ratio,
        canvas.width,
        canvasPage.height,
        0,
        0,
        canvas.width,
        canvasPage.height
      );

      const pageImgData = canvasPage.toDataURL("image/png");
      if (position > 0) pdf.addPage();
      pdf.addImage(pageImgData, "PNG", 0, 0, adjustedWidth, pdfHeight);

      position += pdfHeight;
    }

    pdf.save("submission.pdf");
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={generatePDF}
        className="fixed top-4 left-4 z-50 mb-4 px-4 py-2 rounded"
      >
        Export as PDF
      </Button>

      <div
        ref={contentRef}
        className="w-full flex flex-col gap-4 flex-grow bg-background h-full rounded-2xl p-8 overflow-y-auto"
      >
        {elements.map((element) => {
          const FormComponent = FormElements[element.type].formComponent;
          const value = responses[element.id];

          return (
            <div key={element.id} className="pointer-events-none opacity-100">
              <FormComponent
                elementInstance={element}
                defaultValue={value}
                isInvalid={false}
                submitValue={() => { }}
                readOnly={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
