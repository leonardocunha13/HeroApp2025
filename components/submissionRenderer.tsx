import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FormElementInstance, FormElements } from "./FormElements";

interface Props {
  elements: FormElementInstance[];
  responses: { [key: string]: any };
}

export default function SubmissionRenderer({ elements, responses }: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleRightClick = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!contentRef.current) return;

    const element = contentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = {
      width: canvas.width,
      height: canvas.height,
    };

    const imgHeightMM = (imgProps.height * 0.264583);
    const imgWidthMM = (imgProps.width * 0.264583);

    const ratio = Math.min(pdfWidth / imgWidthMM, 1);
    const adjustedWidth = imgWidthMM * ratio;
    const adjustedHeight = imgHeightMM * ratio;

    let position = 0;

    // Add pages until all content fits
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
    <div>
      <div
        ref={contentRef}
        className="max-w-[1000px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto"
        onContextMenu={handleRightClick}
      >
        {elements.map((element) => {
          const FormComponent = FormElements[element.type].formComponent;
          const value = responses[element.id];

          return (
            <div key={element.id} className="pointer-events-none opacity-70">
              <FormComponent
                elementInstance={element}
                defaultValue={value}
                isInvalid={false}
                submitValue={() => {}}
                readOnly={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
