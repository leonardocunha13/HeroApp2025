import DesignerContextProvider from "./context/DesignerContext";
//import DropCanvas from "./DropCanvas";
import DesignerSidebar from "./DesignerSideBar";

const FormBuilderPage = () => {
  return (
    <DesignerContextProvider>
      <div style={{ display: "flex" }}>
        <DesignerSidebar />
        
      </div>
    </DesignerContextProvider>
  );
};

export default FormBuilderPage;
