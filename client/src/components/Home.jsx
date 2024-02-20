import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup'

function Home() {
    const [user, setUser] = useState(null)



const onSignup =(newUser) =>{
    setUser(newUser)
    console.log(user)
}

  return(
    <Signup user={user} onSignup={onSignup} />
  ) 
}

export default Home;
