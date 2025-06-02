const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    return false;
  }
};

// Send thank you email
const sendThankYouEmail = async (contactData) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured');
    return false;
  }

  const mailOptions = {
    from: `"Gatistwam" <${process.env.SMTP_USER}>`,
    to: contactData.email,
    subject: 'Thank you for contacting Gatistwam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You for Contacting Us!</h2>
        <p>Dear ${contactData.name},</p>
        <p>Thank you for reaching out to Gatistwam. We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a summary of your message:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Message:</strong> ${contactData.message}</p>
        </div>
        <p>If you have any additional questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The Gatistwam Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Thank you email sent successfully to:', contactData.email);
    return true;
  } catch (error) {
    console.error('Error sending thank you email:', error);
    return false;
  }
};

// Send reply email
const sendReplyEmail = async (contactData, replyMessage) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured');
    return false;
  }

  const mailOptions = {
    from: `"Gatistwam" <${process.env.SMTP_USER}>`,
    to: contactData.email,
    subject: 'Reply from Gatistwam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${contactData.name},</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          ${replyMessage}
        </div>
        <p style="color: #666;">Best regards,<br>Gatistwam Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reply email sent successfully to:', contactData.email);
    return true;
  } catch (error) {
    console.error('Error sending reply email:', error);
    return false;
  }
};

module.exports = {
  sendThankYouEmail,
  sendReplyEmail,
  verifyTransporter
}; 