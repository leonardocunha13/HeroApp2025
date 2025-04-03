import { Tabs, Divider, Text } from '@aws-amplify/ui-react';
import * as Avatar from '@radix-ui/react-avatar';
import './pages/Styles/styles.css';
import { useAuthenticator } from '@aws-amplify/ui-react'; // Assuming you're using the auth hook
import { useState } from 'react';
import HomePage from '../src/pages/HomePage'; // Assuming your component imports
import CreateFormDialog from '../src/components/CreateFormDialog'; // Assuming your component imports
import CollectionForms from '../src/pages/RunForm'; // Assuming your component imports

const App: React.FC = () => {
  const { signOut, user } = useAuthenticator();  // Assuming `user` provides the user info
  
  // Track the active tab
  const [tab, setTab] = useState('1');

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
        
        {/* App Name (Left side) */}
        <Text fontWeight="bold" fontSize="large" style={{ fontSize: '24px', color: '#333' }}>
          Hero Engineering Audit App
        </Text>

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
              {user?.userId ? user.userId.charAt(0).toUpperCase() : 'U'}
            </Avatar.Fallback>
          </Avatar.Root>

          {/* Username (next to avatar) */}
          <Text style={{ marginLeft: '10px', fontSize: '16px', color: '#333' }}>
            {user?.userId || 'User'}
          </Text>
        </div>
      </div>

      {/* Divider below the top bar */}
      <Divider orientation="horizontal" width="100%" margin="small" style={{ marginTop: '80px' }} /> {/* Added margin-top to push content below the fixed top bar */}

      {/* Main content below the avatar and divider */}
      <div style={{ padding: '20px', marginTop: '100px' }}> {/* Added padding to ensure content is not too close to the top */}
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
              label: 'Forms',
              value: '2',
              content: (
                <>
                  {/* Conditionally render CreateFormDialog when showFormDialog is true */}
                  <CreateFormDialog />
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
        <button onClick={signOut}>Sign out</button>
      </div>
    </>
  );
};

export default App;