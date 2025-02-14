'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import LoginPage from "./log_in/page";
import HomeTab from "./tabs/HomeTab";
import AboutUsTab from "./tabs/AboutUsTab";
import ServicesTab from "./tabs/ServicesTab";
import ResourcesTab from "./tabs/ResourcesTab";
import ContactUs from "./tabs/ContactUs";

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
      }, 5000);

      return () => clearInterval(interval);
  }, []);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
  };

  return (
      <div>
          <header>
              <nav>
                  <Image src="/Logo_Improved_bg_removed.png" alt="Logo" width={200} height={200} />
                  <ul>
                      <li><a href="#home" onClick={(e) => {e.preventDefault(); setActiveTab('home'); setShowLogin(false); window.scrollTo(0, 0);}}>Home</a></li>
                      <li><a href="#about" onClick={(e) => {e.preventDefault(); setActiveTab('about'); setShowLogin(false); window.scrollTo(0, 0);}}>About Us</a></li>
                      <li><a href="#services" onClick={(e) => {e.preventDefault(); setActiveTab('services'); setShowLogin(false); window.scrollTo(0, 0);}}>Services</a></li>
                      <li><a href="#resources" onClick={(e) => {e.preventDefault(); setActiveTab('resources'); setShowLogin(false); window.scrollTo(0, 0);}}>Resources</a></li>
                      <li><a href="#contactus" onClick={(e) => {e.preventDefault(); setActiveTab('contactus'); setShowLogin(false); window.scrollTo(0, 0);}}>Contact Us</a></li>
                  </ul>
                  <button className="login-btn" onClick={() => {setShowLogin(true); window.scrollTo(0, 0);}}>Login</button>
              </nav>
          </header>

          <main>
              {!showLogin ? (
                  <>
                      {activeTab === 'home' && <HomeTab currentImageIndex={currentImageIndex} nextImage={nextImage} prevImage={prevImage} />}
                      {activeTab === 'about' && <AboutUsTab />}
                      {activeTab === 'services' && <ServicesTab />}
                      {activeTab === 'resources' && <ResourcesTab />}
                      {activeTab === 'contactus' && <ContactUs />} {/* Contact Us Tab */}
                      {/* Add other tabs here */}
                  </>
              ) : (
                  <LoginPage />
              )}
          </main>
          <footer>
            <p>© 2025 RRTax Incorporated</p>
          </footer>
      </div>
      
  );
}


