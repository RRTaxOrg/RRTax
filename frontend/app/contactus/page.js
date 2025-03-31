'use client';

//Imported necessary React hooks and icons
import { useState } from "react";
import { ChevronDownIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import map from '../../public/map.png';// Imported the Map Image 

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  

  const handleChange = (e) => {
    const { name, value } = e.target;

  //  limiting to 10 digits
  if (name === "phone") {
    // Remove non-digit characters
    const formattedValue = value.replace(/\D/g, "");

    // Update the state with the formatted value 
    setFormData({ ...formData, [name]: formattedValue.slice(0, 10) });
  } else {
    setFormData({ ...formData, [name]: value });
  }
   // setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Used to prevent the dafualt Submission
    setStatus("Sending..."); // 
    try {

      // Send the Form Info to API endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Show Success message and reset the form
      if (res.ok) {
        setStatus("Message sent successfully!"); 
        setFormData({ name: "", email: "", phone: "", message: "" });
      } 
      // Server Error
      else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      setStatus("Error sending message.");
    }
  };

  return ( 
    //Background of page
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 mt-20">
     
     {/* Main Section for Contact form */}
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/*Header Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Have questions or need assistance?<br />
              Our team is here to help you 24/7.
            </p>
          </div>
        </div>

          {/* Contact Form */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-xl bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
           {/* Name input field */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <UserCircleIcon className="h-5 w-5 inline-block mr-1 text-customBlue" />
                Name
              </label>
              <input
                id="name"
                name="name"
              type="text"
              autoComplete="given-name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
                className="mt-1 block w-full rounded-lg border border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 px-4 py-3 text-gray-900"
/>
            </div>
            {/* Email input field (spans two columns) */}
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <EnvelopeIcon className="h-5 w-5 inline-block mr-1 text-customBlue" />
                Email
              </label>
              <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="4eM0S@example.com"
              required
                className="mt-1 block w-full rounded-lg border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 px-4 py-3 text-gray-900"
/>
            </div>
             {/* Phone number input field */}
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <PhoneIcon className="h-5 w-5 inline-block mr-1 text-customBlue" />
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                required
                className="mt-1 block w-full rounded-lg border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 px-4 py-3 text-gray-900"
/>
            </div>


             {/* Message textarea field (spans two columns) */}
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                <ChatBubbleLeftIcon className="h-5 w-5 inline-block mr-1 text-customBlue" />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                required
                className="mt-1 block w-full rounded-lg border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 px-4 py-3 text-gray-900"
/>
            </div>
 
            {/* Submit button and status message */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-customBlue px-6 py-4 text-lg font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Send Message
              </button>
              {/*Color Changing button based on status */}
              {status && (
                <p className={`mt-4 text-center text-sm font-medium ${
                  status.includes("success") ? "text-green-600" : "text-red-600"
                }`}>
                  {status}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
      
      {/* Map Image at the bottom of the page */}
      <div className="w-full px-4 md:px-8 lg:px-16 pb-12">
        <div className="relative mx-auto max-w-6xl">
          <img 
            src={map.src} 
            alt="Location Map" 
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-xl border-2 border-gray-200"
          />
          <div className="absolute inset-0 rounded-xl bg-black bg-opacity-10 flex items-center justify-center">
            <button className="bg-white bg-opacity-80 px-6 py-4 rounded-lg" onClick={ () => window.open("https://maps.app.goo.gl/aA4scFrd15PkYzSc9", "_blank")}>
              <h3 className="text-lg md:text-xl font-bold text-customBlue">Find Us Here</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );



}







