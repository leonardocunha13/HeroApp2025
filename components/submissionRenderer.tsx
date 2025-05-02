"use client";

import { FormElementInstance, FormElements } from "./FormElements";

interface Props {
  elements: FormElementInstance[];
  responses: { [key: string]: any };
}

export default function SubmissionRenderer({ elements, responses }: Props) {
  return (
    <div className="max-w-[1000px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
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
  );
}
