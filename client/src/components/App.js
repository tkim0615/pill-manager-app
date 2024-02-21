import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'
import User from './User'
import Prescription from './Prescription';

function App() {
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

  return (
    <>
      <NavBar user={user}/>

      <Routes>
        <Route path="/" element={<Home user={user} onLogOut={onLogOut} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={onLogin}/>} />
        <Route path="/users/:id" element={<User user={user} />} />
        <Route path="/prescriptions" element={<Prescription user={user} />} />
        {/* <Route path="/prescriptions/:id" element={<Prescription />} /> */}
      </Routes>
    </>
    

    



    )

}

export default App;
