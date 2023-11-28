const emailPassword = process.env.EMAIL_PASSWORD;
const nodemailer = require('nodemailer');

exports.sendVerificationEmail = async (email, token) => {
    // Use your email service to send an email
    // The email should contain a link to your frontend which calls the verifyEmail endpoint
    // Example link: https://yourfrontend.com/verify-email?token=xxx
    // Create reusable transporter object using SMTP transport
    console.log("password is", emailPassword);
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email provider
      auth: {
        user: 'poosdproject@gmail.com', // Replace with your email
        pass: emailPassword // Replace with your email password
      }
    });
  
    // Email content
    const mailOptions = {
      from: '"Sched" <poosdproject@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `${token} is your Sched activation code`, // Subject line
      html: `
                <p>Hello,</p>
                <p>Your Sched activation code is: <strong>${token}</strong></p>
                <p>You can also activate your account by clicking on the link below:</p>
                <a href="https://large.poosd-project.com/verify-email/${token}">Verify Email</a>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,</p>
                <p>The Sched Team</p>
            ` // HTML body
    };
  
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }

exports.sendPasswordResetEmail = async (email, resetLink) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email provider
      auth: {
        user: 'poosdproject@gmail.com', // Replace with your email
        pass: emailPassword // Replace with your email password
      }
    });
  
    // Email content for password reset
    const mailOptions = {
      from: '"Sched" <poosdproject@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Sched Password Reset Request', // Subject line
      html: `
                <p>Hello,</p>
                <p>You have requested to reset your password for your Sched account.</p>
                <p>Please click on the link below to set a new password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                <p>Best regards,</p>
                <p>The Sched Team</p>
            ` // HTML body
    };
  
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Password Reset Email sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending password reset email: ', error);
    }
}
