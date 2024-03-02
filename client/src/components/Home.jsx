// import React, { useState, useEffect } from 'react';
// import { Route, Routes } from 'react-router-dom';
// import Signup from './Signup'
// import Login from './Login'
// import Logout from './Logout'
// import NavBar from './NavBar'
// import User from './User'

// function Home({user, onLogin, onLogOut}) {
    
//   return(
//     <>
//       {user ? 
//               (<div>
//               <p>Welcome {user.name}!</p>
//               <Logout onLogOut={onLogOut}/>
//               </div>) 
//               : 
//               (<div>
//               <Login onLogin={onLogin} />
//               </div>)
//           }
    
//     </>
//   )}

// export default Home;

import React from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'
import NavBar from './NavBar'
import UsageInstructions from './UsageInstructions'


function Home({ user, onLogOut }) {
  return (
    <>
      <div className="landing-page">
        {user ? (
          <div>
            <p>Welcome, {user.name}!</p>
            <UsageInstructions />
            <Logout onLogOut={onLogOut} />
          </div>
        ) : (
          <div>
            <h1>Welcome to Pill Manager</h1>
            <p>
              Manage your prescriptions with ease. Sign up or log in to get
              started.
            </p>
            <div>
              <Link to="/signup">Sign Up</Link>
              <span> | </span>
              <Link to="/login">Log In</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;

