// app/layout.tsx
'use client';

import "./globals.css"; // Tailwind globals or your own styles
import { ReactNode } from "react";
import { ThemeProvider as AmplifyThemeProvider, Theme, ColorMode } from "@aws-amplify/ui-react";
import { Authenticator } from "@aws-amplify/ui-react";
import DesignerContextProvider from "../components/context/DesignerContext";
import { ThemeProvider as NextThemeProvider } from "../components/providers/ThemeProvider";
import { Toaster } from "../components/ui/toaster";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css"; // Optional, if you're using Amplify tokens

//import "../src/pages/Styles/styles.css"; // Your custom styles
const inter = Inter({ subsets: ["latin"] });

Amplify.configure(outputs);

// Optional: use dark mode by default
const colorMode: ColorMode = "dark";

// Optional Amplify UI Theme
const theme: Theme = {
  name: "my-dark-theme",
  overrides: [
    {
      colorMode: "dark",
      tokens: {
        colors: {
          font: {
            primary: { value: "{colors.black.100}" },
            secondary: { value: "{colors.black.90}" },
            tertiary: { value: "{colors.black.80}" },
          },
          background: {
            primary: { value: "{colors.blue.10}" },
            secondary: { value: "{colors.blue.20}" },
            tertiary: { value: "{colors.blue.40}" },
          },
          border: {
            primary: { value: "{colors.black.60}" },
            secondary: { value: "{colors.black.40}" },
            tertiary: { value: "{colors.black.20}" },
          },
        },
      },
    },
  ],
};

/*export const metadata: Metadata = {
  title: "Fox Form Creator",
  description:
    "Another Next.js project also using Typescript, Dnd-Kit, PostgreSQL, Prisma, Tailwind",
};*/

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />

        <Authenticator>
          {({ user: _user, signOut: _signOut }) => (
            <AmplifyThemeProvider theme={theme} colorMode={colorMode}>
              <DesignerContextProvider>
                <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
                  {children}
                  <Toaster />
                </NextThemeProvider>
              </DesignerContextProvider>
            </AmplifyThemeProvider>
          )}
        </Authenticator>

      </body>
    </html>
  );
}
