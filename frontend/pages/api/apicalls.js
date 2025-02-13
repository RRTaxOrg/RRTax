/* 
in this file we make all the api calls
This is the backend and connects to the frontend i.e the app folder
the app folder sends requests to the api folder and the api folder sends responses back to the app folder
*/

































// export default async function handler(req, res) {
//     if (req.method === "POST") {
//       const { name, email, message } = req.body;
  
//       // Validate input
//       if (!name || !email || !message) {
//         return res.status(400).json({ error: "All fields are required." });
//       }
  
//       try {
//         // Send email using Nodemailer
//         const nodemailer = require("nodemailer");
  
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: process.env.EMAIL_USER, // Your Gmail
//             pass: process.env.EMAIL_PASS, // App Password
//           },
//         });
  
//         const mailOptions = {
//           from: email,
//           to: process.env.EMAIL_TO, // Recipient email
//           subject: `Contact Form Submission from ${name}`,
//           text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
//         };
  
//         await transporter.sendMail(mailOptions);
  
//         return res.status(200).json({ message: "Email sent successfully!" });
//       } catch (error) {
//         return res.status(500).json({ error: "Error sending email." });
//       }
//     } else {
//       return res.status(405).json({ error: "Method Not Allowed" });
//     }
//   }
  