import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup'
import Login from './Login'
import Logout from './Logout'
import NavBar from './NavBar'
import User from './User'
import Prescription from './Prescription'


function Home() {
    const [user, setUser] = useState(null)

    useEffect(() => {
      fetch('/check_session')
        .then((r) => {
          if (!r.ok) {
            throw new Error('Session check failed');
          }
          return r.json();
        })
        .then((user) => setUser(user))
        .catch(() => setUser(null));
    }, []);

    const onLogin =(user) =>{
    setUser(user)
    }

    const onLogOut = ()=>{
      setUser(null)
    }
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
            {user && (
          <div>
            <User user={user} />
          </div>
          
      )}
       <div>
            <Prescription user={user} />
          </div>
    </>

  ) 
}

export default Home;
