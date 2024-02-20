import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'
import User from './User'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/:id" element={<User />} />



      </Routes>
    </>
    

    



    )

}

export default App;
