import { useAuthenticator } from '@aws-amplify/ui-react'
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';


function App() {
  const { signOut } = useAuthenticator();
  return (
    <>
      <div>
        <Sidebar>
          <Menu>
            <SubMenu label='Forms'>
              <MenuItem component={<Link to="/createforms" />}> Create Form</MenuItem>
              <MenuItem component={<Link to="/editforms" />}> Edit Form</MenuItem>
              <MenuItem component={<Link to="/deleteforms" />}> Delete Form</MenuItem>
            </SubMenu>
            <MenuItem > Form</MenuItem>
            <MenuItem component={<Link to="/dashboard" />}> Dashboard</MenuItem>
            <MenuItem component={<Link to="/other" />}> Other</MenuItem>
          </Menu>
        </Sidebar>

      </div>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}
export default App;
