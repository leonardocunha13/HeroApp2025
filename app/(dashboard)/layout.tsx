'use client';

import '../globals.css';
import Logo from "../../components/Logo";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { ReactNode} from "react";
import { Authenticator, Avatar, IconsProvider } from '@aws-amplify/ui-react';
import { FiUser } from 'react-icons/fi';
import { signOut } from '@aws-amplify/auth';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
//import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut();
      console.log("User signed out");
      router.push('/'); 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
/*const { username, userId, signInDetails } = await getCurrentUser();

console.log("username", username);
console.log("user id", userId);
console.log("sign-in details", signInDetails);*/
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo />
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />

          <Authenticator>
            {({ user }) => (
              <IconsProvider
                icons={{
                  avatar: {
                    user: <FiUser />,
                  },
                }}
              >
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="flex items-center gap-2 focus:outline-none">
                    <Avatar
                      alt={user?.username || "User"}
                      size="large"
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-medium">{user?.username}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem>
                      {({ active }: { active: boolean }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </IconsProvider>
            )}
          </Authenticator>
        </div>
      </nav>

      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}

export default Layout;
