import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup'
import Login from './Login'
import Logout from './Logout'
import NavBar from './NavBar'
import User from './User'
import Prescription from './Prescription'

function Home({user, onLogin, onLogOut}) {
    
  return(
    <>
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
  )}

export default Home;
