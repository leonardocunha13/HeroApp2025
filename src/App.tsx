import { Tabs, Text, Button } from '@aws-amplify/ui-react';
import * as Avatar from '@radix-ui/react-avatar';
import './pages/Styles/styles.css';
import { useAuthenticator } from '@aws-amplify/ui-react'; // Assuming you're using the auth hook
import { useState } from 'react';
import HomePage from '../src/pages/HomePage'; // Assuming your component imports
import CreateFormDialog from '../src/components/CreateFormDialog'; // Assuming your component imports
import CollectionForms from '../src/pages/RunForm'; // Assuming your component imports
import RunningForm from '../src/pages/RunningForm'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing necessary router components

const App: React.FC = () => {
  const { signOut, user } = useAuthenticator(); // Assuming `user` provides the user info

  // Track the active tab
  const [tab, setTab] = useState('1');
  const [formCreated, setFormCreated] = useState(false);

  
  // This function will be passed as a prop to CreateFormDialog
  const handleFormCreated = () => {
    setFormCreated(true); // Example action after form is created
  };

  return (
    
    <>
      {/* Top Bar (Fixed at the top of the page) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f8f9fa',
        zIndex: 10  // Ensure it sits on top of other content
      }}>

    
        {/* Logo */}
        <img 
          src="\logo.png" 
          alt="App Logo" 
          style={{ width: '300px', height: '100px' }} 
        />

        {/* Avatar and Username (Right side) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Radix UI Avatar */}
          <Avatar.Root style={{ display: 'inline-block', position: 'relative' }}>
            <Avatar.Image
              src=""
              alt="User Avatar"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                display: 'block',
                objectFit: 'cover'
              }}
            />
            <Avatar.Fallback
              delayMs={600}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#999999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px'
              }}
            >
              {/* Fallback content (Initials) */}
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar.Fallback>
          </Avatar.Root>

          {/* Username (next to avatar) */}
          <Text style={{ marginLeft: '10px', fontSize: '16px', color: '#333' }}>
            {user?.username || 'User'}
          </Text>
        </div>
      </div>

      {/* Main content below the avatar and divider */}
      <div style={{ position: 'fixed', padding: '20px', marginTop: '-450px', marginLeft:'-500px' }}> {/* Added padding to ensure content is not too close to the top */}
        <Tabs
          value={tab}
          onValueChange={(tab) => setTab(tab)} // Switch tabs
          items={[
            {
              label: 'Home',
              value: '1',
              content: (
                <>
                  <HomePage />
                </>
              ),
            },
            {
              label: 'Create New Form',
              value: '2',
              content: (
                <>
                  {/* Pass handleFormCreated function as a prop to CreateFormDialog */}
                  <CreateFormDialog onFormCreated={handleFormCreated} />
                </>
              ),
            },
            {
              label: 'Forms List',
              value: '3',
              content: (
                <>
                  <CollectionForms />
                </>
              ),
            },
          ]}
        />

        {/* Optionally, you can add a sign-out button */}
        <Button onClick={signOut}>Sign out</Button>
        
        {/* You can display a message or trigger any logic when a form is created */}
        {formCreated && <p>Form created successfully!</p>}
      </div>
      <Routes>
          {/*<Route path="/" element={<HomePage />} />*/}
          {/*<Route path="/RunningForm/:projectID" element={<RunningForm />*/} 
          {/*<Route path="/FormsList" element={<CollectionForms />} />*/}
        </Routes>
    </>
  );
};

export default App;
