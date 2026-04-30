import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ethara.Ai Team Task Manager",
  description: "Manage your team's tasks and projects efficiently.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-text-main`}>
        <AuthProvider initialUser={session}>
          {session ? (
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6">
                  {children}
                </main>
              </div>
            </div>
          ) : (
            <main className="min-h-screen">
              {children}
            </main>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
