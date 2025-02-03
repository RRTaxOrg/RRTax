'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';

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

  return (
      <div>
          <header>
              <nav>
                  <ul>
                      <Image src="/RRTax_logo.jpg" alt="Logo" width={200} height={200} />
                      <li><a href="#home" onClick={() => { setActiveTab('home'); setShowLogin(false); }}>Home</a></li>
                      <li><a href="#about" onClick={() => { setActiveTab('about'); setShowLogin(false); }}>About Us</a></li>
                      <li><a href="#services" onClick={() => { setActiveTab('services'); setShowLogin(false); }}>Services</a></li>
                      <li><a href="#resources" onClick={() => { setActiveTab('resources'); setShowLogin(false); }}>Resources</a></li>
                      <li><a href="#contactus" onClick={() => { setActiveTab('contactus'); setShowLogin(false); }}>Contact Us</a></li>
                      <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
                  </ul>
              </nav>
          </header>

          <main>
              {!showLogin ? (
                  <>
                      <section id="home" className={`tab-content ${activeTab === 'home' ? 'active' : 'hidden'}`}>
                      <div className="flex justify-center items-center h-[400px] w-full relative">
                          <Image 
                            src="/Building1.jpg" 
                            alt="Image 1" 
                            width={470} 
                            height={425} 
                            style={{ display: currentImageIndex === 0 ? 'block' : 'none' }} 
                          />
                          <Image 
                            src="/Building2.jpg" 
                            alt="Image 2" 
                            width={630} 
                            height={190} 
                            style={{ display: currentImageIndex === 1 ? 'block' : 'none' }} 
                          />
                          <Image 
                            src="/Building3.jpg" 
                            alt="Image 3" 
                            width={540} 
                            height={124} 
                            style={{ display: currentImageIndex === 2 ? 'block' : 'none' }} 
                          />
                      </div>

                      <footer>
                        <p>© 2025 My Website</p>
                      </footer>

                      </section>

                      <section id="about" className={`tab-content ${activeTab === 'about' ? 'active' : 'hidden'}`}>
                          <div className="Body">
                              <p>About Us...</p>
                          </div>
                      </section>
                  </>
              ) : (
                  <Login />
              )}
          </main>

          
      </div>
  );
}

function Login() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-customWhite">
        <div className="flex flex-col items-center w-full max-w-md space-y-8">
          <Image src="/Logo_Improved_bg_removed.png" alt="Logo" width={500} height={500} />
          <div className="w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-customBlue">Login</h2>
            <form className="mt-8 space-y-6">
              <input id="email-address" type="email" required placeholder="Email address" className="w-full px-3 py-2 border rounded-t-md" />
              <input id="password" type="password" required placeholder="Password" className="w-full px-3 py-2 border rounded-b-md" />
              <button type="submit" className="w-full px-4 py-2 text-white bg-customBlue rounded-md">Sign in</button>
            </form>
          </div>
        </div>
      </div>
    );
}
