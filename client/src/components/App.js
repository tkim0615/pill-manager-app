import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'
import User from './User'
import Prescription from './Prescription';

function App() {
  return (
    <>
      {/* <NavBar/> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/prescriptions" element={<Prescription />} />
        {/* <Route path="/prescriptions/:id" element={<Prescription />} /> */}


        



      </Routes>
    </>
    

    



    )

}

export default App;
