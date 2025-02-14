import { motion } from "framer-motion";

export default function ResourcesTab() {
    return(
        <section id="resources" className="tab-content active">
            <div className="bodyalt">
                <div className="background-section-resources">
                    <div className="circle-container-resources">
                        <br></br>
                        <h1>Resources</h1>
                        <p>RR Tax Accounting and Financial Services Corporation</p>
                    </div>
                </div>
                <br></br>
                <div className="body">
                    <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="text-lg">At RR TAX AND FINANCIAL SERVICES , we strive to empower our clients with the information
                     and tools they need to make smart financial decisions. Below, you'll find a collection
                      of trusted resources to help you stay informed about Canadian tax regulations, 
                      financial planning, and more.</motion.p>
                      <br></br>
                      <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl font-bold">Key Resources</motion.h1>
                </div>
                <div className="resources-lists-container">
                    <div className="resources-list">
                    <br></br>
                    <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="text-2xl font-bold">Canada Revenue Agency (CRA)</motion.p>
                        <ul>
                            <motion.li
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-lg">  ● <a href="https://www.canada.ca/en/revenue-agency.html">
                                    CRA My Account: Manage your personal tax information, view notices of assessment,
                                     and track your benefits and credits.</a></motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-lg">  ● <a href="https://www.canada.ca/en/employment-social-development.html">
                                    CRA Business Account: Access your business tax information, file returns, and make payments.</a></motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-lg">  ● <a href="https://www.canada.ca/en/imm">
                                    CRA Forms and Publications: Browse a complete list of tax forms, guides, and publications</a></motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-lg">  ● <a href="https://www.canada.ca/en/imm">
                                    CRA Payment Options: Learn about payment methods for individuals and businesses.</a></motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-lg">  ● <a href="https://www.canada.ca/en/imm">
                                    GST/HST Information: Find details about registering for, collecting, and remitting GST/HST.</a></motion.li>
                            <br></br>
                        </ul>
                    </div>
                </div>
            </div>        
        </section>
    );
}