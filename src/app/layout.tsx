import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNav from "./_components/nav/MainNav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Punto Online",
  description: "Play punto online with your friends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen h-screen"}>
        <div className="flex justify-between m-1 absolute top-0 left-0">
          <MainNav></MainNav>
          {/* <LoginOrOut></LoginOrOut> */}
          <Toaster />
        </div>
        {children}
      </body>
    </html>
  );
}
