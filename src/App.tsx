import { useAuthenticator } from '@aws-amplify/ui-react'
//import { Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
//import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Tabs, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';


function App() {
  const { signOut } = useAuthenticator();
  const [tab, setTab] = useState('1');
  return (
    <>
    <Tabs
      value={tab}
      onValueChange={(tab) => setTab(tab)}
      items={[
        {
          label: 'Forms',
          value: '1',
          content: (
            <>
              <p>Content of the First tab.</p>
              <Button isFullWidth onClick={() => setTab('1')}>
                Create Form
              </Button>
              <Button isFullWidth onClick={() => setTab('1')}>
                Delete Form
              </Button>
            </>
          ),
        },
        {
          label: 'Dashboard',
          value: '2',
          content: (
            <>
              <p>Content of the second tab.</p>
              <Button isFullWidth onClick={() => setTab('2')}>
                Go to Dashboard
              </Button>
            </>
          ),
        },
      ]}
    />
    <button onClick={signOut}>Sign out</button>
    
    </>
    
    
    
  );

 /* return (
    <>
      <div>
        <Sidebar>
          <Menu>
            <SubMenu label='Forms'>
              <MenuItem component={<Link to="/createforms" />}> Create Form</MenuItem>
              <MenuItem component={<Link to="/editforms" />}> Edit Form</MenuItem>
              <MenuItem component={<Link to="/deleteforms" />}> Delete Form</MenuItem>
            </SubMenu>
            <MenuItem component={<Link to="/dashboard" />}> Dashboard</MenuItem>
            <MenuItem component={<Link to="/other" />}> Other</MenuItem>
          </Menu>
        </Sidebar>

      </div>
      <button onClick={signOut}>Sign out</button>
    </>
  );*/
}
export default App;
