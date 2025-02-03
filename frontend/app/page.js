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
                      <div className="body">
                        <br></br>
                        <br></br>
                        <h1><strong>Our Mission</strong></h1>
                        <br></br>
                        <p>At RR TAX ACCOUNTING AND FINANCIAL SERVICES , our mission is to empower individuals and 
                          businesses across Canada to achieve financial success through reliable, accurate, and 
                          personalized accounting services.
                        </p>
                        <br></br>
                        <p>We are committed to simplifying complex financial processes, ensuring compliance, and 
                          providing expert advice that fosters growth and stability.
                        </p>
                        <br></br>
                        <p>By building strong relationships with our clients and prioritizing their unique needs, 
                          we strive to be a trusted partner in their journey toward long-term prosperity.
                        </p>
                        <br></br>
                        <h1><strong>What we do</strong></h1>
                        <br></br>
                        <p>At RR TAX ACCOUNTING AND FINANCIAL SERVICES, we specialize in managing your financial 
                          records, ensuring compliance with tax regulations, and providing expert advice to help 
                          you make informed financial decisions.
                        </p>
                        <br></br>
                        <p>From bookkeeping and preparing financial statements to tax planning and filing, we 
                          handle the numbers so you can focus on growing your business.
                        </p>
                        <br></br>
                        <p>We also assist with budgeting, cash flow management, and strategic planning to 
                          ensure your financial health stays on track.
                        </p>
                        <p>Whether you’re an individual, a small business owner, or an entrepreneur, we're here 
                          to simplify your finances and help you achieve your goals.
                        </p>
                        <br></br>
                        <br></br>
                      </div>
                      <footer>
                        <p>© 2025 My Website</p>
                      </footer>

                      </section>

                      <section id="about" className={`tab-content ${activeTab === 'about' ? 'active' : 'hidden'}`}>
                      <div className="body">
                        <br></br>
                        <br></br>
                        <h1><strong>About Us</strong></h1>
                        <br></br>
                        <p>At RR TAX ACCOUNTING AND FINANCIAL SERVICES, we are dedicated to providing personalized
                           and professional accounting services to individuals, small businesses, and entrepreneurs
                            across Canada. With a commitment to accuracy, integrity, and exceptional client service,
                             we aim to be your trusted financial partner.
                        </p>
                        <br></br>
                        <p>Founded with a passion for helping businesses thrive, our team brings years of experience
                           in accounting, tax planning, and financial advisory services. We understand the unique 
                           challenges faced by Canadian businesses and individuals, and we tailor our solutions to meet
                            your specific needs.
                        </p>
                        <br></br>
                        <p>Whether you’re navigating the complexities of tax compliance, seeking advice to 
                          grow your business, or simply need help managing your finances, we’re here to guide
                           you every step of the way. Our approachable and knowledgeable team prides itself 
                           on building long-term relationships and delivering results that matter.
                        </p>
                        <br></br>
                        <p><legend>Let us handle the numbers, so you can focus on what you do best.</legend></p>
                        <br></br>
                        <h2>Contact us today to see how we can help you achieve your financial goals!</h2>
                        <br></br>
                        <br></br>
                      </div>
                      <footer>
                        <p>© 2025 My Website</p>
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
