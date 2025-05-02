import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useAuthenticator,
  Button,
  Breadcrumbs,
  SelectField,
  Avatar,
} from "@aws-amplify/ui-react";
import { FiSun, FiMoon } from "react-icons/fi";
import HomePage from "../src/pages/HomePage";
import CreateFormDialog from "../components/CreateFormDialog";
import CollectionForms from "../src/pages/RunForm";
import ProjectLog from "../src/pages/ProjectLog";
import FormBuilder from "./pages/FormBuilder";
import DesignerContextProvider from "../components/context/DesignerContext";
import '../src/pages/Styles/styles.css'

const breadcrumbOptions = ["Home", "Create Form", "Form List", "Project Log"];

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const routeMap: Record<string, string> = {
    Home: "/",
    "Create Form": "/create-form",
    "Form List": "/forms-list",
    "Project Log": "/project-log",
  };

  const handleBreadcrumbSelect = (value: string) => {
    const path = routeMap[value];
    if (path) navigate(path);
  };

  function toggleDarkMode(): void {
    setDarkMode((prevMode) => !prevMode);
  }

  return (
    <div
      className={darkMode ? "dark" : ""}
      style={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#ffffff",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      <div
        className={`top-bar ${darkMode ? "dark" : ""}`}
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          backdropFilter: "blur(12px)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          backgroundColor: darkMode ? "#1e1e1e" : "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src="/logo.png"
            alt="App Logo"
            style={{ width: "100px", height: "30px" }}
          />
          <Breadcrumbs.Container>
            <Breadcrumbs.Item>
              <SelectField
                className="select"
                label="Navigation"
                labelHidden
                variation="quiet"
                size="small"
                onChange={(e) => handleBreadcrumbSelect(e.target.value)}
                options={breadcrumbOptions}
              />
            </Breadcrumbs.Item>
          </Breadcrumbs.Container>
        </div>
        <div>
          <Button
            onClick={toggleDarkMode}
            variation="link"
            size="small"
            style={{
              backgroundColor: darkMode ? "#333" : "#e0e0e0",
              color: darkMode ? "#fff" : "#000",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              marginLeft: "12px",
            }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </Button>
          <Avatar style={{ padding: "8px 12px", marginLeft: "12px" }}>
            HE
          </Avatar>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: "80px", padding: "24px", width: "100%" }}>
        <DesignerContextProvider>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forms-list" element={<CollectionForms />} />
            <Route
              path="/create-form"
              element={<CreateFormDialog onFormCreated={() => { }} />}
            />
            <Route path="/form-builder/:formId" element={<FormBuilder />} />
            <Route path="/project-log" element={<ProjectLog />} />
          </Routes>

        </DesignerContextProvider>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={signOut}
            style={{
              backgroundColor: darkMode ? "#444" : "#6f6e72",
              color: darkMode ? "#fff" : "#000",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;