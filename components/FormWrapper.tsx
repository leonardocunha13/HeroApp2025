import { useForm, FormProvider } from "react-hook-form"; 
import { SeparatorFieldFormElement } from "./fields/SeparatorField"; // Your component import

const FormWrapper = () => {
  const methods = useForm(); // Initialize the form methods

  return (
    <FormProvider {...methods}>
      <SeparatorFieldFormElement />
    </FormProvider>
  );
};

export default FormWrapper;
