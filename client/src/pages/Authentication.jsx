import styled from "styled-components";

import React from "react";
import LogoImage from "../utils/Images/Logo.png";
import AuthImage from "../utils/Images/AuthImage.jpg";
import SignIn from "../components/SignIn.jsx";
import SignUp from "../components/SignUp.jsx";

const Container = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.bg};
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  position: relative;
  background: blue;
  @media (max-width: 700px) {
    display: none;
  }
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 40px;
  gap: 20px;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  position: absolute;
  width: 70px;
  top: 40px;
  left: 60px;
  z-index: 10;
`;

const Image = styled.img`
  position: relative;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const Text = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 26px;
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;
const TextButton = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
`;
const Authentication = () => {
  const [login, setLogin] = React.useState(false);
  return (
    <Container>
      <Left>
        <Logo src={LogoImage} />
        <Image src={AuthImage} />
      </Left>
      <Right>
        {!login ? (
          <>
            <SignIn />
            <Text>
              Don't have an account?{" "}
              <TextButton onClick={() => setLogin(true)}>SignUp</TextButton>
            </Text>
          </>
        ) : (
          <>
            <SignUp />
            <Text>
              Already have an account?{" "}
              <TextButton onClick={() => setLogin(false)}>SignIn</TextButton>
            </Text>
          </>
        )}
      </Right>
    </Container>
  );
};

export default Authentication;
