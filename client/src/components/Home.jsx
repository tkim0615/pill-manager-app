import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup'
import Login from './Login'
import Logout from './Logout'
import NavBar from './NavBar'


function Home() {
    const [user, setUser] = useState(null)

    const onLogin =(user) =>{
    setUser(user)
    }

    const onLogOut = ()=>{
      setUser(null)
    }
//rather than having login vs signup, have signup render at all times? in login page, make small link for sign up
  return(
    <>
      <NavBar user={user}/>

      {user ? 
              (<div>
              <p>Welcome {user.name}!</p>
              <Logout onLogOut={onLogOut}/>
              </div>) 
              : 
              (<div>
              <p>Please login</p>
              <Login onLogin={onLogin} />
              </div>)
              
          }
    </>

  ) 
}

export default Home;
