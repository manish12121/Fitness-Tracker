import React, { useState } from 'react'
import styled from 'styled-components'
import TextInput from './TextInput.jsx';
import Button from './Button.jsx';
import { useDispatch } from 'react-redux';
import { UserSignIn } from '../api/index.js';
import { loginSuccess } from '../redux/reducer/userSlice.js';

const Container = styled.div`
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 36px;
`;
const Title = styled.div`
font-size: 32px;
font-weight: 800;
color: ${({ theme }) => theme.text_primary};   
`;
const Span = styled.span`
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary};
`;
const SignIn = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validateInputs = () => {
        if(!email || !password) {
            alert ("Please fill in all the fields");
            return false;
        }
        return true;
    };

    const handleSignIn = async() => {
        setLoading(true);
        setButtonDisabled(true);
        if(validateInputs()){
            await UserSignIn({email, password}).then((res)=>{
                dispatch(loginSuccess(res.data));
                alert("Login Success");
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
      <div style={{
        display:'flex',
        gap: "20px",
        flexDirection: "column",
      }}>
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
            text="SignIn"
            onClick={handleSignIn}
            isLoading={loading}
            isDisabled={buttonDisabled}
        />
      </div>
    </Container>
  )
}

export default SignIn
