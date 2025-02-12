import { motion } from "framer-motion";

export default function ServicesTab() {
  return (
    <section id="services" className="tab-content active">
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
  );
}