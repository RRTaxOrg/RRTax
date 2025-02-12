import Image from "next/image";
import { motion } from "framer-motion";

export default function HomeTab({ currentImageIndex, nextImage, prevImage }) {
  return (
    <section id="home" className="tab-content active">
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
      <footer>
        <p>© 2025 RRTax Incorporated</p>
      </footer>
    </section>
  );
}