export default async (req, res) => {
    const nodemailer = require('nodemailer');

    const { to, subject, content } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        text: content
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error sending email' });
    }
};
