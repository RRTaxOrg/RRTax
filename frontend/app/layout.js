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
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateTo = (path) => {
    setMenuOpen(false); // Close menu on navigation
    router.push(path);
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <nav>
            <Image src={navImage} alt="Logo" width={200} height={200} className="logo" />
            {/* Hamburger button for mobile */}
            <button
              className="hamburger"
              aria-label="Open navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
              <span />
            </button>
            {/* Desktop nav */}
            <ul className="nav-links">
              <li>
                <a onClick={(e) => { e.preventDefault(); navigateTo("/"); }}>Home</a>
              </li>
              <li>
                <a onClick={(e) => { e.preventDefault(); navigateTo("/aboutus"); }}>About Us</a>
              </li>
              <li>
                <a onClick={(e) => { e.preventDefault(); navigateTo("/appointments"); }}>Appointments</a>
              </li>
              <li>
                <a onClick={(e) => { e.preventDefault(); navigateTo("/resources"); }}>Resources</a>
              </li>
              <li>
                <a onClick={(e) => { e.preventDefault(); navigateTo("/contactus"); }}>Contact Us</a>
              </li>
            </ul>
            {/* Mobile nav */}
            {menuOpen && (
              <ul className="mobile-nav">
                <li>
                  <a onClick={(e) => { e.preventDefault(); navigateTo("/"); }}>Home</a>
                </li>
                <li>
                  <a onClick={(e) => { e.preventDefault(); navigateTo("/aboutus"); }}>About Us</a>
                </li>
                <li>
                  <a onClick={(e) => { e.preventDefault(); navigateTo("/appointments"); }}>Appointments</a>
                </li>
                <li>
                  <a onClick={(e) => { e.preventDefault(); navigateTo("/resources"); }}>Resources</a>
                </li>
                <li>
                  <a onClick={(e) => { e.preventDefault(); navigateTo("/contactus"); }}>Contact Us</a>
                </li>
              </ul>
            )}
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