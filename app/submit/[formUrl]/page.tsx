import { GetFormContentByUrl } from "../../../actions/form";
import { FormElementInstance } from "../../../components/FormElements";
import FormSubmitComponent from "../../../components/FormSubmitComponent";

// Params will be available once the component is resolved
async function SubmitPage({
  params,
}: {
  params: {
    formUrl: string;
  };
}) {
  const { formUrl } = await params; 
  const form = await GetFormContentByUrl(formUrl);
  
  if (!form) {
    throw new Error("form not found");
  }
 
  const formContent = JSON.parse(form.content ?? "[]") as FormElementInstance[];

  return <FormSubmitComponent formUrl={formUrl} content={formContent} />;
  
}

export default SubmitPage;