import React from "react";
import "../globals.css";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export const metadata = {
  title: "Padanama Admin Console",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased" suppressHydrationWarning>
        <AdminLayoutShell>{children}</AdminLayoutShell>
      </body>
    </html>
  );
}
