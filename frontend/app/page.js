'use client';

import logo from '../public/Logo_Improved_bg_removed.png';
import logo2 from '../public/RRTax_logo.jpg';
import Image from "next/image";
import { useEffect, useState } from 'react';

// Your existing login function (no changes needed here)
function Login() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-customWhite">
      <div className="flex flex-col items-center w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src={logo} alt="Logo" width={500} height={500} />
        </div>

        {/* Login Form */}
        <div className="w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-customBlue font-geist">
            Login
          </h2>
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-customAqua focus:border-customAqua font-geist"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-customAqua focus:border-customAqua font-geist"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-customAqua border-gray-300 rounded focus:ring-customAqua"
                />
                <label
                  htmlFor="remember-me"
                  className="block ml-2 text-sm text-gray-900 font-geist"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-customAqua hover:text-customLightGreen font-geist"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-customBlue border border-transparent rounded-md group hover:bg-customAqua focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customAqua font-geist"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
    const [activeTab, setActiveTab] = useState('home');
    const [showLogin, setShowLogin] = useState(false); // State to toggle login form

    useEffect(() => {
        const tabs = document.querySelectorAll('nav a');
        const tabContents = document.querySelectorAll('.tab-content');
        const carouselImages = document.querySelectorAll('.carousel img');
        const loginButton = document.querySelector('.login-btn'); // Select login button

        tabs.forEach(tab => {
          tab.addEventListener('click', (event) => {
              event.preventDefault();
              const tabId = tab.dataset.tab;
              setActiveTab(tabId);
              setShowLogin(false); // Hide login form when tab is clicked
  
              tabContents.forEach(content => content.classList.remove('active'));
              tabs.forEach(t => t.classList.remove('active'));
              tab.classList.add('active');
              document.getElementById(tabId).classList.add('active');
          });
      });

        let currentImageIndex = 0;
        const interval = setInterval(() => {
            carouselImages[currentImageIndex].classList.remove('active');
            currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
            carouselImages[currentImageIndex].classList.add('active');
        }, 5000);

        // Login button click handler
        loginButton.addEventListener('click', () => {
          setShowLogin(true); // Show the login form
      });

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        {/* ... (Your navigation links - same as before) */}
                        <Image src={logo2} alt="Logo" width={200} height={200} />
                        <li><a href="#home" data-tab="home" className={activeTab === 'home' ? 'active' : "flex justify-center"}>Home</a></li>
                        <li><a href="#about" data-tab="about" className={activeTab === 'about' ? 'active' : "flex justify-center"}>About Us</a></li>
                        <li><a href="#services" data-tab="services" className={activeTab === 'services' ? 'active' : "flex justify-center"}>Services</a></li>
                        <li><a href="#resources" data-tab="resources" className={activeTab === 'resources' ? 'active' : "flex justify-center"}>Resources</a></li>
                        <li><a href="#contactus" data-tab="contactus" className={activeTab === 'contactus' ? 'active' : "flex justify-center"}>Contact Us</a></li>
                        <button className="login-btn">Login</button>
                        {/* ... other tabs ... */}
                    </ul>
                    
                </nav>
            </header>
            <main>
                <section id="home" className={`tab-content ${activeTab === 'home' ? 'active' : ''}`}>
                    
                <div className="carousel-container"> {/* Add a container */}
                    <div className="carousel">
                        <Image src={logo} alt="Image 1" width={250} height={250} className="active" />
                        <Image src={logo2} alt="Image 2" width={250} height={250}  />
                        <Image src={logo} alt="Image 3" width={250} height={250} />
                    </div>
                </div>

                    <div className="Body">
                        <p>Our mission: At RR TAX ACCOUNTING AND FINANCIAL SERVICES, our mission is to empower
                           individuals and businesses across Canada to achieve financial success through 
                           reliable, accurate, and personalized accounting services. We are committed to 
                           simplifying complex financial processes, ensuring compliance, and providing expert 
                           advice that fosters growth and stability. By building strong relationships with our 
                           clients and prioritizing their unique needs, we strive to be a trusted partner in 
                           their journey toward long-term prosperity.</p>
                        <br></br>
                        <p>What we do: At RR TAX ACCOUNTING AND FINANCIAL SERVICES, we specialize in managing
                           your financial records, ensuring compliance with tax regulations, and providing 
                           expert advice to help you make informed financial decisions. From bookkeeping and 
                           preparing financial statements to tax planning and filing, we handle the numbers so 
                           you can focus on growing your business</p>
                        <br></br>
                        <p>We also assist with budgeting, cash flow management, and strategic planning to 
                          ensure your financial health stays on track. Whether you’re an individual, a small
                           business owner, or an entrepreneur, we’re here to simplify your finances and help
                            you achieve your goals.
                        </p>

                    </div>
                    
                </section>
                {/* ... (Other sections) */}
                <section id="about" className={`tab-content ${activeTab === 'about' ? 'active' : ''}`}>
                    <div className="Body">
                        <p>Our mission: At RR TAX ACCOUNTING AND FINANCIAL SERVICES, our mission is to empower individuals and businesses across Canada to achieve financial success through reliable, accurate, and personalized accounting services. We are committed to simplifying complex financial processes, ensuring compliance, and providing expert advice that fosters growth and stability. By building strong relationships with our clients and prioritizing their unique needs, we strive to be a trusted partner in their journey toward long-term prosperity.</p>
                    </div>
                    <div className="carousel">
                        <Image src={logo} alt="Image 1" width={500} height={500} className="active" /> {/* Use next/image */}
                        <Image src={logo} alt="Image 2" width={500} height={500} />
                        <Image src={logo} alt="Image 3" width={500} height={500} />
                    </div>
                </section>
            </main>

            {/* Conditionally render the Login component */}
            {showLogin && <Login />} {/* Show login only when showLogin is true */}
        </div>
    );
}


