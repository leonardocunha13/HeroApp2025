import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './pages/Styles/styles.css';
import {
  useAuthenticator,
  Button,
  Breadcrumbs,
  SelectField
} from '@aws-amplify/ui-react';

import { FiSun, FiMoon } from 'react-icons/fi';

import HomePage from '../src/pages/HomePage';
import CreateFormDialog from '../src/components/CreateFormDialog';
import CollectionForms from '../src/pages/RunForm';
import RunningForm from '../src/pages/RunningForm';
import ProjectLog from '../src/pages/ProjectLog';
import FormBuilder from './pages/BuildForm';

const breadcrumbOptions = ['Forms', 'Create Form', 'Form List', 'Project Log'];

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const routeMap: Record<string, string> = {
    'Forms': '/forms',
    'Create Form': '/form-builder',
    'Form List': '/forms-list',
    'Project Log': '/project-log', // Make sure this route is defined
  };

  const handleBreadcrumbSelect = (value: string) => {
    const path = routeMap[value];
    if (path) navigate(path);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Top Navigation Bar */}
      <div
        className={`top-bar ${darkMode ? 'dark' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          transition: 'background-color 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="/logo.png"
            alt="App Logo"
            style={{ width: '150px', height: '50px' }}
          />


          {/* Breadcrumb Navigation */}
          <Breadcrumbs.Container>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
              <Breadcrumbs.Separator />
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <SelectField
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
        {/* Dark Mode Toggle */}
        <div>
          <Button
            onClick={toggleDarkMode}
            variation="link"
            size="small"
            style={{
              backgroundColor: darkMode ? '#333' : '#e0e0e0',
              color: darkMode ? '#fff' : '#000',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              marginLeft: '12px',
            }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ marginTop: '70px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forms" element={<CreateFormDialog onFormCreated={() => { }} />} />
          <Route path="/forms-list" element={<CollectionForms />} />
          <Route path="/form-builder" element={<FormBuilder />} />
          {/* Optional route if you use "Project Log" */}
          <Route path="/project-log" element={<div>Project Log Page</div>} />
        </Routes>
      </div>

      {/* Sign Out Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={signOut}
          style={{
            backgroundColor: darkMode ? '#444' : '#6f6e72',
            color: darkMode ? '#fff' : '#000',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            width: '100%',
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};


export default App;