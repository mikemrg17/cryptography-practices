import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3 space-x-2">
              <span className="text-default-600">Hecho por:</span>,
              <Link href="https://mikemrg.netlify.app/" target="_blank">
                <span className="text-primary">Miguel</span>
              </Link>
              ,
              <Link
                href="https://extraordinary-lamington-2099db.netlify.app/"
                target="_blank"
              >
                <span className="text-primary">Dorian</span>
              </Link>
              <span className="text-default-600">y</span>
              <Link
                href="https://sites.google.com/view/davidlopez3cm12?usp=sharing"
                target="_blank"
              >
                <span className="text-primary">David</span>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
