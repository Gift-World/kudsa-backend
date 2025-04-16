require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or App Password
    }
});

// API endpoint to send emails
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Email details
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'kudsadeans@gmail.com', // Your email to receive messages
        subject: `New Message from ${name}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
        replyTo: email
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ success: false, message: 'Failed to send message' });
        }
        res.status(200).send({ success: true, message: 'Message sent successfully!' });
    });
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
