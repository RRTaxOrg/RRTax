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
                <div className="resources-lists-container">
                    <div className="resources-list">
                        <h1>Useful Links</h1>
                        <ul>
                            <motion.li
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-lg">  ● <a href="https://www.canada.ca/en/revenue-agency.html">Canada Revenue Agency</a></motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-lg">  ● <a href="https://www.canada.ca/en/employment-social-development.html">Employment and Social Development Canada</a></motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-lg">  ● <a href="https://www.canada.ca/en/imm"></a></motion.li>
                        </ul>
                    </div>
                </div>
            </div>        
        </section>
    );
}