import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup'
import Login from './Login'


function Home() {
    const [user, setUser] = useState(null)



const onSignup =(newUser) =>{
    setUser(newUser)
}


//rather than having login vs signup, have signup render at all times? in login page, make small link for sign up
  return(
    <div>

        <Login /> 
        {/* <Signup user={user} onSignup={onSignup} onSignedUp={onSignedUp} />  */}
    </div>

  ) 
}

export default Home;
