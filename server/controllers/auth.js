import Otp from "../models/Otp.js";
import { sendOtpMail } from "../middleware/sendEmail.js";

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpMail(email, otp);

    res.json({ message: "OTP sent" });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({
      email: email.toLowerCase(),
      otp: otp.toString()
    });

    if (!record) {
      return next(createError(400, "Invalid OTP"));
    }

    if (record.expiresAt < Date.now()) {
      await Otp.deleteOne({ _id: record._id });
      return next(createError(400, "OTP expired"));
    }

    // OTP is correct → delete it
    await Otp.deleteOne({ _id: record._id });

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    next(err);
  }
};

