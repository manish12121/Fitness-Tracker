import { useState, useEffect } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button.jsx";
import { useDispatch } from "react-redux";
import { sendOtp, UserSignUp } from "../api/index.js";
import { loginSuccess } from "../redux/reducer/userSlice.js";

const Container = styled.div``;
const Title = styled.h1``;
const Span = styled.span``;

const SignUp = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [otp, setOtp] = useState("");
const [otpTimer, setOtpTimer] = useState(0);
const [otpLoading, setOtpLoading] = useState(false);
const [showOtp, setShowOtp] = useState(false);


useEffect(() => {
  if (otpTimer === 0) return;

  const timer = setInterval(() => {
    setOtpTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [otpTimer]);


  const validateInputs = () => {
    if (!name || !email || !password) {
      alert("Please fill in all the fields");
      return false;
    }
    return true;
  };
  const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  const handleSignUp = async() => {
          setLoading(true);
          setButtonDisabled(true);
          if(validateInputs()){
              await UserSignUp({name, email, password, otp}).then((res)=>{
                  dispatch(loginSuccess(res.data));
                  alert("Account Created Successfully");
              setLoading(false);
              setButtonDisabled(false);
              }).catch((err)=> {
                  alert(err.response.data.message);
                  setLoading(false);
                  setButtonDisabled(false);
              });
              
          }
      };
  const handleSendOtp = async () => {
  if (otpTimer > 0) return;   // block resend

  try {
    setOtpLoading(true);

    await sendOtp(email);   // your API call

    setShowOtp(true); 
    setOtpTimer(30);            // start 30 sec countdown
    alert("OTP sent to your email");
  } catch (err) {
    alert(err.response?.data?.message || "OTP failed");
  } finally {
    setOtpLoading(false);
  }
};







  return (
    <Container>
      <div>
        <Title>Welcome to Fittrack</Title>
        <Span>Please login with your details</Span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <TextInput 
            label="Full Name" 
            placeholder="Enter your full name" 
            value={name}
            handleChange={(e)=> setName(e.target.value)}
        />
        <TextInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            handleChange={(e)=> setEmail(e.target.value)}
        />
        <Button
  onClick={handleSendOtp}
  disabled={otpTimer > 0 || otpLoading}
  text={
    otpTimer > 0
      ? `Resend OTP in ${otpTimer}s`
      : otpLoading
      ? "Sending..."
      : "Send OTP"
  }
/>
  {showOtp && (
  <TextInput
    label="OTP"
    placeholder="Enter OTP"
    value={otp}
    handelChange={(e) => setOtp(e.target.value)}
  />
)}

        <TextInput 
            label="Password" 
            placeholder="Enter your password" 
            password
            value={password}
            handleChange={(e)=> setPassword(e.target.value)}
            
        />
        <Button 
            text="SignUp" 
            onClick={handleSignUp}
            isLoading={loading}
            isDisabled={buttonDisabled}
            />
      </div>
    </Container>
  );
};

export default SignUp;
