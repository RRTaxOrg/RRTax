'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";

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
                      
                      <li><a href="#home" onClick={(e) => {e.preventDefault(); /* Prevent default anchor behavior*/ setActiveTab('home'); setShowLogin(false); window.scrollTo(0, 0);  /* Scroll to top on click*/}}>Home</a></li>
                      <li><a href="#about" onClick={(e) => {e.preventDefault(); /* Prevent default anchor behavior*/ setActiveTab('about'); setShowLogin(false); window.scrollTo(0, 0);  /* Scroll to top on click*/}}>About Us</a></li>
                      <li><a href="#services" onClick={(e) => {e.preventDefault(); /* Prevent default anchor behavior*/ setActiveTab('services'); setShowLogin(false); window.scrollTo(0, 0);  /* Scroll to top on click*/}}>Services</a></li>
                      <li><a href="#resources" onClick={(e) => {e.preventDefault(); /* Prevent default anchor behavior*/setActiveTab('resources'); setShowLogin(false); window.scrollTo(0, 0);  /* Scroll to top on click*/}}>Resources</a></li>
                      <li><a href="#contactus" onClick={(e) => {e.preventDefault(); /* Prevent default anchor behavior*/ setActiveTab('contactus'); setShowLogin(false); window.scrollTo(0, 0);  /* Scroll to top on click*/}}>Contact Us</a></li>
                      
                  </ul>
                  <button className="login-btn" onClick={() => {setShowLogin(true); window.scrollTo(0, 0);  /* Scroll to top on click*/ }}>Login</button>
              </nav>
          </header>

          <main>
              {!showLogin ? (
                  <>
                      <section id="home" className={`tab-content ${activeTab === 'home' ? 'active' : 'hidden'}`}>
                      <div className="carousel-container">
                            {/* Left Button */}
                            <button className="carousel-button left" onClick={prevImage}>
                              &#10094; {/* Left Arrow Symbol (‹) */}
                            </button>
                            <Image 
                              src="/Building1.jpg" 
                              alt="Image 1" 
                              width={1548} 
                              height={865} 
                              style={{ display: currentImageIndex === 0 ? 'block' : 'none' }} 
                            />
                            <Image 
                              src="/Building2.jpg" 
                              alt="Image 2" 
                              width={1548} 
                              height={865} 
                              style={{ display: currentImageIndex === 1 ? 'block' : 'none' }} 
                            />
                            <Image 
                              src="/Building3.jpg" 
                              alt="Image 3" 
                              width={1548} 
                              height={865}  
                              style={{ display: currentImageIndex === 2 ? 'block' : 'none' }} 
                            />
                            {/* Right Button */}
                            <button className="carousel-button right" onClick={nextImage}>
                              &#10095; {/* Right Arrow Symbol (›) */}
                            </button>        
                      </div>
                      <div className="body">
                        
                        <br></br>
                        <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl font-bold">Our Mission</motion.h1>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                        className="text-lg">At RR TAX ACCOUNTING AND FINANCIAL SERVICES , our mission is to empower individuals and 
                          businesses across Canada to achieve financial success through reliable, accurate, and 
                          personalized accounting services.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2 }}
                        className="text-lg">We are committed to simplifying complex financial processes, ensuring compliance, and 
                          providing expert advice that fosters growth and stability.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.4 }}
                        className="text-lg">By building strong relationships with our clients and prioritizing their unique needs, 
                          we strive to be a trusted partner in their journey toward long-term prosperity.
                        </motion.p>
                        <br></br>
                      </div>
                      <div className="prose">
                        <br></br>
                        <br></br>
                        <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl font-bold"
                        >What we do</motion.h1>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-lg">At RR TAX ACCOUNTING AND FINANCIAL SERVICES, we specialize in managing your financial 
                          records, ensuring compliance with tax regulations, and providing expert advice to help 
                          you make informed financial decisions.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2 }}
                        className="text-lg">From bookkeeping and preparing financial statements to tax planning and filing, we 
                          handle the numbers so you can focus on growing your business.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.4 }}
                        className="text-lg">We also assist with budgeting, cash flow management, and strategic planning to 
                          ensure your financial health stays on track.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.6 }}
                        className="text-lg">Whether you're an individual, a small business owner, or an entrepreneur, we're here 
                          to simplify your finances and help you achieve your goals.
                        </motion.p>
                        <br></br>
                        <br></br>
                      </div>
                      <footer>
                        <p>© 2025 RRTax Incorporated</p>
                      </footer>

                      </section>

                      <section id="about" className={`tab-content ${activeTab === 'about' ? 'active' : 'hidden'}`}>
                      <div className="bodyalt">
                        
                        <div className="background-section">
                          <div className="circle-container">
                            <br></br>
                            <br></br>
                            <h1>About Us</h1>
                            <br></br>
                            <p>RR Tax Accounting and Financial Services Corporation</p>
                          </div>
                        </div>
                        <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl font-bold">About Us</motion.h1>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-lg">At RR TAX ACCOUNTING AND FINANCIAL SERVICES, we are dedicated to providing personalized
                           and professional accounting services to individuals, small businesses, and entrepreneurs
                            across Canada. With a commitment to accuracy, integrity, and exceptional client service,
                             we aim to be your trusted financial partner.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                        className="text-lg">Founded with a passion for helping businesses thrive, our team brings years of experience
                           in accounting, tax planning, and financial advisory services. We understand the unique 
                           challenges faced by Canadian businesses and individuals, and we tailor our solutions to meet
                            your specific needs.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0 }}
                        className="text-lg">Whether you're navigating the complexities of tax compliance, seeking advice to 
                          grow your business, or simply need help managing your finances, we're here to guide
                           you every step of the way. Our approachable and knowledgeable team prides itself 
                           on building long-term relationships and delivering results that matter.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1 }}
                        className="text-lg">Let us handle the numbers, so you can focus on what you do best.</motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2 }}
                        className="text-lg">Contact us today to see how we can help you achieve your financial goals!</motion.p>
                        <br></br>
                        <br></br>
                      </div>
                      <footer>
                        <p>© 2025 RRTax Incorporated</p>
                      </footer>
                      </section>

                      <section id="services" className={`tab-content ${activeTab === 'services' ? 'active' : 'hidden'}`}>
                      <div className="bodyalt">
                        
                        <div className="background-section-services">
                          <div className="circle-container-services">
                            
                            <h1>Services</h1>
                            
                            <p>RR Tax Accounting and Financial Services Corporation</p>
                          </div>
                        </div>
                        <br></br>
                        <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl font-bold">Services</motion.h1>
                        <br></br>
                        <ul>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● CORPORATE AND BUSINESS TAX</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● CORPORATE TAX RETURN</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● INCORPORATION</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● TAX AUDITS / APPEAL</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● SELF- EMPLOYED</motion.li>
                        </ul>
                        <br></br>
                        <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl font-bold">Accounting</motion.h1>
                        <br></br>
                        <ul>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● Financial Statements</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● Bookkeeping</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● Payroll Services</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● Financial Forecasts</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● HST filing</motion.li>
                          <motion.li
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-lg">  ● Accounting software set up (Quickbooks)</motion.li>
                          </ul>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                        className="text-lg">Founded with a passion for helping businesses thrive, our team brings years of experience
                           in accounting, tax planning, and financial advisory services. We understand the unique 
                           challenges faced by Canadian businesses and individuals, and we tailor our solutions to meet
                            your specific needs.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0 }}
                        className="text-lg">Whether you're navigating the complexities of tax compliance, seeking advice to 
                          grow your business, or simply need help managing your finances, we're here to guide
                           you every step of the way. Our approachable and knowledgeable team prides itself 
                           on building long-term relationships and delivering results that matter.
                        </motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1 }}
                        className="text-lg">Let us handle the numbers, so you can focus on what you do best.</motion.p>
                        <br></br>
                        <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2 }}
                        className="text-lg">Contact us today to see how we can help you achieve your financial goals!</motion.p>
                        <br></br>
                        <br></br>
                      </div>
                      <footer>
                        <p>© 2025 RRTax Incorporated</p>
                      </footer>
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
      <div className="flex items-center justify-center min-h-screen bg-customWhite mt-20">
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
