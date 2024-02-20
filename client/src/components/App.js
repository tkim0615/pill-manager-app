import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />


      </Routes>
    </>
    

    



    )

}

export default App;
