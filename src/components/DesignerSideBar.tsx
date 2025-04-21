import useDesigner from "./hooks/useDesigner";
import FormElementsSidebar from "./FormElementsSideBar";
import PropertiesFormSidebar from "./PropertiesFormSidebar";

function DesignerSidebar() {
  const { selectedElement } = useDesigner();

  return (
    <>

      {!selectedElement && <FormElementsSidebar />}
      {selectedElement && <PropertiesFormSidebar />}

    </>

  );
}

export default DesignerSidebar;
