import { useRef, useEffect } from "react";
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

  useEffect(() => {
    // Adding event listener to ensure proper page load before rendering PDF
    const handlePageLoad = () => {
      if (contentRef.current) {
        contentRef.current.style.visibility = "visible";
      }
    };
    window.addEventListener("load", handlePageLoad);
    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  const generatePDF = async () => {
    if (!contentRef.current) return;

    const pageGroups: FormElementInstance[][] = [];
    let currentGroup: FormElementInstance[] = [];

    elements.forEach((el) => {
      if (el.type === "PageBreakField") {
        if (currentGroup.length > 0) pageGroups.push(currentGroup);
        currentGroup = [];
      } else {
        currentGroup.push(el);
      }
    });
    if (currentGroup.length > 0) pageGroups.push(currentGroup);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // We now render pages and handle page breaks inside the loop
    for (let i = 0; i < pageGroups.length; i++) {
      const group = pageGroups[i];

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "1000px"; // ensure large enough width for rendering
      tempContainer.style.padding = "2rem";
      tempContainer.style.backgroundColor = "white";

      group.forEach((el) => {
        const FormComponent = FormElements[el.type].formComponent;
        const value = responses[el.id];

        const wrapper = document.createElement("div");
        const elementRoot = (
          <FormComponent
            elementInstance={el}
            defaultValue={value}
            isInvalid={false}
            submitValue={() => {}}
            readOnly={true}
          />
        );

        // Use ReactDOM to render the element asynchronously
        import("react-dom/client").then(({ createRoot }) => {
          createRoot(wrapper).render(elementRoot);
        });

        tempContainer.appendChild(wrapper);
      });

      document.body.appendChild(tempContainer);

      await new Promise((resolve) => setTimeout(resolve, 500)); // delay to allow rendering

      // Force the content to render completely, especially for complex elements like tables
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,  // Ensure external resources (like fonts) are used
        logging: true,  // Log for debugging to see what might be wrong
        allowTaint: true,
        ignoreElements: (element) => {
          return element.tagName === "BUTTON"; // Ignore buttons or other unnecessary elements
        }
      });

      const imgHeightMM = canvas.height * 0.264583;
      const imgWidthMM = canvas.width * 0.264583;
      const ratio = Math.min(pdfWidth / imgWidthMM, 1);
      const adjustedWidth = imgWidthMM * ratio;
      const adjustedHeight = imgHeightMM * ratio;

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, adjustedWidth, adjustedHeight);

      document.body.removeChild(tempContainer);
    }

    pdf.save("submission.pdf");
  };

  return (
    <div className="flex flex-col items-center">
      {/* Export Button */}
      <Button
        onClick={generatePDF}
        className="fixed top-4 left-4 z-50 mb-4 px-4 py-2 rounded"
      >
        Export as PDF
      </Button>

      {/* Form content */}
      <div
        ref={contentRef}
        className="w-full flex flex-col gap-4 flex-grow bg-background h-full rounded-2xl p-8 overflow-y-auto"
        style={{ visibility: "hidden" }} // Make sure to hide until fully rendered
      >
        {(() => {
          const pageGroups: FormElementInstance[][] = [];
          let currentGroup: FormElementInstance[] = [];

          elements.forEach((el) => {
            if (el.type === "PageBreakField") {
              if (currentGroup.length > 0) pageGroups.push(currentGroup);
              currentGroup = [];
            } else {
              currentGroup.push(el);
            }
          });
          if (currentGroup.length > 0) pageGroups.push(currentGroup);

          return pageGroups.map((group, idx) => (
            <div key={idx} className="pdf-page mb-8">
              {group.map((element) => {
                const FormComponent = FormElements[element.type].formComponent;
                const value = responses[element.id];
                return (
                  <div key={element.id}>
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
          ));
        })()}
      </div>
    </div>
  );
}
