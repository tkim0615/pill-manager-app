import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup'
import Login from './Login'


function Home() {
    const [user, setUser] = useState(null)
    const [signedUp, setSignedUp] = useState(false)




const onSignup =(newUser) =>{
    setUser(newUser)
}
const onSignedUp = () =>{
    setSignedUp(signedUp => !signedUp)
}
console.log(signedUp)


  return(
    <div>

    {signedUp? <Login /> : <Signup user={user} onSignup={onSignup} onSignedUp={onSignedUp} /> }
    </div>

  ) 
}

export default Home;
