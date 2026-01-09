import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button.jsx";
import { useDispatch } from "react-redux";
import { UserSignUp } from "../api/index.js";
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

  const validateInputs = () => {
    if (!name || !email || !password) {
      alert("Please fill in all the fields");
      return false;
    }
    return true;
  };

  const handleSignUp = async() => {
          setLoading(true);
          setButtonDisabled(true);
          if(validateInputs()){
              await UserSignUp({name, email, password}).then((res)=>{
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
