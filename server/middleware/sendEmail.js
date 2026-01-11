import nodemailer from "nodemailer";


console.log("SMTP HOST =", process.env.BREVO_SMTP_HOST);
console.log("SMTP PORT =", process.env.BREVO_SMTP_PORT);


const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: `FitTrack <${process.env.BREVO_SENDER_EMAIL}>`,
    to: email,
    subject: "Your FitTrack OTP",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};
