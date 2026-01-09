import styled, { ThemeProvider } from "styled-components";
import lightTheme from "./utils/Themes";
import { BrowserRouter } from "react-router-dom";
import Authentication from "./pages/Authentication.jsx";
import { use } from "react";  
import { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Workouts from "./pages/Workouts.jsx";
import Tutorials from "./pages/Tutorials.jsx";
import Blogs from "./pages/Blogs.jsx";
import Contact from "./pages/Contact.jsx";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.25s ease-in-out;
  `;  


function App() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
      {currentUser ?(
        <Container>
          <Navbar currentUser={currentUser}/>
          <Routes>
            <Route path="/" exact element={<Dashboard/>}/>
            <Route path="/Workouts" exact element={<Workouts/>}/>
            <Route path="/Tutorials" exact element={<Tutorials/>}/>
            <Route path="/Blogs" exact element={<Blogs/>}/> 
            <Route path="/Contact" exact element={<Contact/>}/>

          </Routes>
        </Container> 
      ):(
        <Container>
          <Authentication />
        </Container>
      )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;