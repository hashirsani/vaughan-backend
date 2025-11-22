// const express = require("express");
// const nodemailer = require("nodemailer");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// // Load environment variables (from Render secrets automatically)
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Health check route
// app.get("/healthz", (req, res) => {
//     res.send("OK");
// });

// // Optional root route to confirm server is live
// app.get("/", (req, res) => {
//     res.send("Backend is live!");
// });

// // Email sending route
// app.post("/send-email", async (req, res) => {
//     const { name, email, message } = req.body;

//     let transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: Number(process.env.SMTP_PORT),
//         secure: false, // true if using 465 port
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     try {
//         await transporter.sendMail({
//             from: `"Vaughan Electrical Contact Form" <${process.env.EMAIL_USER}>`,
//             replyTo: email,
//             to: process.env.EMAIL_USER,
//             subject: `Message from ${name}`,
//             text: message,
//         });

//         res.status(200).json({ message: "Email sent successfully!" });
//     } catch (error) {
//         console.error("Email sending failed:", error);
//         res.status(500).json({ message: "Failed to send email." });
//     }
// });

// // Use PORT from environment (Render sets this automatically)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// console.log("Loaded ENV:", process.env.EMAIL_USER, process.env.SMTP_HOST);





const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load environment variables (from main folder if needed)
require("dotenv").config({ path: "../.env" }); // adjust path if your .env is in main folder

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check route
app.get("/healthz", (req, res) => res.send("OK"));

// Optional root route to confirm server is live
app.get("/", (req, res) => res.send("Backend is live!"));

// Email sending route using Resend
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: `Vaughan Electrical <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("Loaded ENV:", process.env.EMAIL_USER, process.env.RESEND_API_KEY ? "Resend API loaded" : "No Resend API");
