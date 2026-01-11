// 

import axios from "axios";

export const sendOtpMail = async (email, otp) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "manishadhikari121@gmail.com", name: "FitTrack" },
        to: [{ email }],
        subject: "Your FitTrack OTP",
        htmlContent: `
          <h2>FitTrack Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>Valid for 5 minutes</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Brevo API Error:", err.response?.data || err.message);
    throw new Error("Email service failed");
  }
};
