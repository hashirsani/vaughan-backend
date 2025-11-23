// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// // Load environment variables
// require("dotenv").config({ path: "../.env" }); // adjust if .env is in main folder

// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_API_KEY);

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Health check route
// app.get("/healthz", (req, res) => res.send("OK"));

// // Optional root route to confirm server is live
// app.get("/", (req, res) => res.send("Backend is live!"));

// // Email sending route using Resend
// app.post("/send-email", async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     await resend.emails.send({
//       from: `${name} <${email}>`,             // Visitor email as FROM
//       to: process.env.EMAIL_USER,            // Your official email as TO
//       subject: `New message from ${name}`,   // Visitor name as SUBJECT
//       text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//       html: `<p><strong>Name:</strong> ${name}</p>
//              <p><strong>Email:</strong> ${email}</p>
//              <p><strong>Message:</strong> ${message}</p>`,
//     });

//     res.status(200).json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     res.status(500).json({ message: "Failed to send email." });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// console.log("Loaded ENV:", process.env.EMAIL_USER, process.env.RESEND_API_KEY ? "Resend API loaded" : "No Resend API");



// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// // Load environment variables
// require("dotenv").config({ path: "../.env" }); // adjust to your structure

// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_API_KEY);

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Health check
// app.get("/healthz", (req, res) => res.send("OK"));

// // Basic route
// app.get("/", (req, res) => res.send("Backend is live!"));

// // Email route
// app.post("/send-email", async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     await resend.emails.send({
//       from: process.env.EMAIL_USER, // ALWAYS your domain email
//       to: process.env.EMAIL_USER,   // You receive it
//       reply_to: email,              // Customer email here
//       subject: `New message from ${name}`,
//       text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
//       html: `
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//       `,
//     });

//     res.status(200).json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     res.status(500).json({ message: "Failed to send email." });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// console.log("Loaded ENV:", process.env.EMAIL_USER, process.env.RESEND_API_KEY ? "Resend API loaded" : "No Resend API");



const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/healthz", (req, res) => res.send("OK"));

// SMTP transporter (Hostinger)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,     // info@vaughanelectricalexperts.ca
    pass: process.env.EMAIL_PASS,     // SMTP password from Hostinger
  },
});

// Email route
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `"Website Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New message from ${name}`,
    html: `
      <h3>New Inquiry</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
