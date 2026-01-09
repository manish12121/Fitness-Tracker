import React from "react";
import styled from "styled-components";
import { Link as LinkR, NavLink } from "react-router-dom";
import LogoImg from "../utils/Images/Logo.png";
import { MenuRounded } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducer/userSlice"

const Nav = styled.nav`
  height: 80px;
  background-color: ${({ theme }) => theme.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
 border-bottom: 1px solid ${({ theme }) => theme.text_primary};
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 20px;
  display: flex;
  gap: 14px;
  font-size: 1rem;
  justify-content: space-between;
  align-items: center;
`;

const NavLogo = styled(LinkR)`
display: flex;
align-items: center;
gap: 16px;
padding: 0 16px;
font-size: 18px;
font-weight: 600;
color: ${({ theme }) => theme.black};
text-decoration: none;
`;

const Logo = styled.img`
  height: 40px;
  width: 40px;
`;

const Mobileicon = styled.div`
  display: none;
  color: ${({ theme }) => theme.text_primary};

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItems = styled.ul`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 0 6px;
    list-style: none;

    @media screen and (max-width: 768px) {
      display: none;
    }
`;

const Navlink = styled(NavLink)`
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 1s slide-in;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
    &.active {
      color: ${({ theme }) => theme.primary};
      border-bottom: 1.8px solid ${({ theme }) => theme.primary};
    }
`;

const UserContainer = styled.div`
width:100%;
height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.text_primary};
`;

const TextButton = styled.span`
text-align: end;
  color: ${({ theme }) => theme.secondary};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
`;

const MobileMenu = styled.ul`
  display: flex;
    flex-direction: column;
    align-items: start;
    gap: 16px;
    padding: 0 6px;
    list-style: none;
    width: 90%;
    padding: 12px 40px 24px 40px;
    background: ${({ theme }) => theme.bg};
    position: absolute;
    top: 80px;
    right: 0;
    transition: all 0.3s ease-in-out;
    transform: ${({ isOpen }) => 
        (isOpen ? "translateY(0)" : "translateY(-150%)")};
    border-radius: 0 0 20px 20px;
    box-shadow: 0px 0 10px 0 rgba(0,0,0,0.2);
    opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
    z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")}
`;  

const Navbar = ({ currentUser }) => {
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={()=> setIsOpen(!isOpen)}>
            <MenuRounded sx={{ color: 'inherit' }}/>
        </Mobileicon>
        <NavLogo to="/">
          <Logo src={LogoImg}/>
          Fittrack
        </NavLogo>

        <MobileMenu isOpen={isOpen}>
            <Navlink to="/">Dashboard</Navlink>
            <Navlink to="/workouts">Workouts</Navlink>
            <Navlink to="/tutorials">Tutorials</Navlink>
            <Navlink to="/blogs">Blogs</Navlink>
            <Navlink to="/contact">Contact</Navlink>
        </MobileMenu>

        <NavItems>
            <Navlink to="/">Dashboard</Navlink>
            <Navlink to="/workouts">Workouts</Navlink>
            <Navlink to="/tutorials">Tutorials</Navlink>
            <Navlink to="/blogs">Blogs</Navlink>
            <Navlink to="/contact">Contact</Navlink>
        </NavItems>

        <UserContainer>
            <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
            <TextButton onClick={() => dispatch(logout())}>LogOut</TextButton>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
