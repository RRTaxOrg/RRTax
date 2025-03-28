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
      </div>
    </section>
  );
}