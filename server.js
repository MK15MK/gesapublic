require('dotenv').config(); // Load environment variables
const express = require('express'); // Import Express
const nodemailer = require('nodemailer'); // Import Nodemailer
const path = require('path'); // Import Path

const app = express(); // Initialize Express
const port = 3000; // Port for the server

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Serve the contact form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Handle form submissions
app.post('/send-email', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message || !phone || !subject) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'hotmail', // Adjust service if needed (e.g., Gmail, Outlook)
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECEIVER, // Receiver email
            subject: `Message from ${name} - ${subject}`,
            text: `You have received a message from ${name} (${email}, ${phone}):\n\n${message}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
