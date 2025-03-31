'use client';

import { motion } from "framer-motion";

export default function ServicesTab() {
  return (
    <section id="services" className="tab-content active">
      <div className="bodyalt">
        <div className="background-section-services">
          <div className="circle-container-services">
            <br></br>
            <h1>Services</h1>
            <p>RR Tax Accounting and Financial Services Corporation</p>
          </div>
        </div>
        <br></br>
        
        <div className="services-lists-container">
          <div className="services-list">
            <h1>Tax Services</h1>
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
          </div>
          <div className="services-list">
            <h1>Accounting Services</h1>
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
          </div>
          <div className="services-list">
            <h1>Additional Services</h1>
            <ul>
              <motion.li
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg">  ● Open and managing WSIB for businesses</motion.li>
              <motion.li
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg">  ● Start-up Business Planning</motion.li>
              <motion.li
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg">  ● Financial Consultation</motion.li>
              <motion.li
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg">  ● Bankruptcy / Debt Consultation</motion.li>
              <motion.li
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg">  ● Pension Application</motion.li>
            </ul>
          </div>
        </div>
        <br></br>
        
        <br></br>
                  
          {/* Appointments Section */}
          <div className="body bg-[#F6F4F0]">
              <br></br>
              <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-3xl font-bold text-black">Schedule an Appointment</motion.h1>
              <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="text-lg mt-4 mb-6 text-black">Use our online calendar to schedule a consultation with one of our tax professionals. 
                  Select a convenient date and time that works for you.</motion.p>
              
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="calendar-container">
                  {/* Google Calendar Appointment Scheduling */}
                  <iframe 
                      src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2oh5y4egDW6kbYz6OU8QtnxO91qMG8n6EpaxeAlhLhz7bIAVbvrZGJOXL87feF1TdfvniqUeEA?gv=true" 
                      style={{ border: 0 }} 
                      width="100%" 
                      height="600" 
                      frameBorder="0">
                  </iframe>
              </motion.div>
          </div>
      </div>
    </section>
  );
}