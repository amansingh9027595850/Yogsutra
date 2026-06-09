require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve the static frontend website files from the parent (root) directory
app.use(express.static(path.join(__dirname, '../')));

// Enable CORS for static site domain (or '*' for local development)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Main contact endpoint
app.post('/api/contact', async (req, res) => {
  const { Name, Email, Phone, Subject, Message } = req.body;

  // Simple validation
  if (!Name || !Email || !Message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required fields (Name, Email, Message).'
    });
  }

  // Set up Nodemailer transporter using SMTP settings from .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Compose email content
  const mailOptions = {
    from: `"Yogsutra Web Contact" <${process.env.SMTP_USER}>`,
    to: process.env.RECIPIENT_EMAIL || 'yogsutrayogshala@gmail.com',
    replyTo: `"${Name}" <${Email}>`,
    subject: `New Yogsutra Inquiry: ${Subject || 'General Inquiry'} from ${Name}`,
    text: `
You have received a new inquiry from your website contact form.

Name: ${Name}
Email: ${Email}
Phone: ${Phone || 'Not provided'}
Subject: ${Subject || 'General Inquiry'}

Message:
${Message}
`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent from ${Email} to ${process.env.RECIPIENT_EMAIL}`);
    res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.'
    });
  } catch (error) {
    console.error('Nodemailer Error: ', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while sending your message. Please verify your server credentials or SMTP configuration.'
    });
  }
});

// Run server
app.listen(PORT, () => {
  console.log(`Yogsutra Contact Server running on port http://localhost:${PORT}`);
});
