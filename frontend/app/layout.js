'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import navImage from "../public/Logo_Improved_bg_removed.png";
import { useRouter } from "next/navigation";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const router = useRouter();
  // Define the navigateTo function
  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <nav>
            <Image src={navImage} alt="Logo" width={200} height={200}/>
            <ul>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/");}}>Home</a>
              </li>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/aboutus");}}>About Us</a>
              </li>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/services");}}>Services</a>
              </li>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/resources");}}>Resources</a>
              </li>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/contactus");}}>Contact Us</a>
              </li>
            </ul>
            <button className="login-btn" onClick={(e) => {e.preventDefault(); navigateTo("/log_in");}}>Login</button>
          </nav>
        </header>
        {children}
        <footer>
          <p>© 2025 RRTax Incorporated</p>
        </footer>
      </body>
    </html>
  );
}