import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { ThemeProvider } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteCards",
  description: "A minimal local-first flashcard deck builder and review app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("notecards.theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider />
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <AppHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
