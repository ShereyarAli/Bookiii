import type { Metadata } from "next";
import { Geist, Geist_Mono,  IBM_Plex_Serif, Mona_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Toaster } from "sonner";

// const ibmPlexSerif = IBM_Plex_Serif({
//   variable: "--font-ibm-plex-serif",
//   subsets: ["latin"],
//   weights: ["400", "500", "600", "700"],
//   display: "swap",
// })
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
})

export const metaData: Metadata = {
   title: 'Bookified',
  description: "Transform your Books into interactive Ai conversations. Upload PDfs, and chat with your books using voice."
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${monaSans.variable}   antialiased`}
      > 
        <ClerkProvider>
          <Navbar/>
          {children}
          <Toaster/>
        </ClerkProvider>
      </body>
    </html>
  );
}
