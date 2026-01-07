const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer'); // Import Nodemailer

// Load env vars before checking imports that might use them
dotenv.config({ path: path.join(__dirname, '.env') });

const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Email Transporter (Gmail)
// IMPORTANT: You must enable "App Passwords" in your Google Account for this to work.
// See: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'noorviofficial.in@gmail.com',
        pass: process.env.EMAIL_PASS || 'YOUR_APP_PASSWORD_HERE' // REPLACE THIS WITH YOUR APP PASSWORD
    }
});

// Routes
app.use('/api/products', productRoutes);

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Processing contact form for:", email);

    const mailOptions = {
        from: email, // Sender address (Note: Gmail might override this with the auth user)
        replyTo: email, // Reply to the user's email
        to: 'noorviofficial.in@gmail.com', // Receiver
        subject: `New Inquiry from ${name} - Noorvi Website`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
    }
});

// Fallback for SPA (Removed as we are using multi-page static files)
// If needed for specific routing validation, we can add named routes.


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
