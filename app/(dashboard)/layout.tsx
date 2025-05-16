'use client';

import '../globals.css';
import Logo from "../../components/Logo";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { ReactNode } from "react";
import { Authenticator, Avatar, IconsProvider } from '@aws-amplify/ui-react';
import { FiUser } from 'react-icons/fi';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Amplify } from "aws-amplify"
import outputs from "../../amplify_outputs.json"
import { fetchUserAttributes, signOut } from 'aws-amplify/auth';

Amplify.configure(outputs);

let userAttributes: Partial<Record<string, string>> | null = null;

(async () => {
  try {
    const fetchedAttributes = await fetchUserAttributes();
    userAttributes = Object.fromEntries(
      Object.entries(fetchedAttributes).filter(([_, v]) => v !== undefined)
    );
    console.log("userAttributes", userAttributes);
  } catch (err) {
    console.error("Failed to fetch user attributes:", err);
  }
})();

function Layout({ children }: { children: ReactNode }) {
  function handleSignOut() {
    signOut();
  }

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
                    <span className="text-sm font-medium">{userAttributes?.preferred_username}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem>
                      <button type="button" onClick={handleSignOut}>
                        Sign out
                      </button>
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
