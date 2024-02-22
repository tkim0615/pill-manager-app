import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'
import User from './User'
import Prescription from './Prescription'
import Doctor from './Doctor'
import DosageHistory from './DosageHistory'

function App() {
  const [user, setUser] = useState(null)
  const [dosageHistories, setDosageHistories] = useState([])


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

    useEffect(()=>{
      fetch('/dosage_histories')
          .then(r =>{
              if (!r.ok){
                  throw new Error('Failed to load dosage history')
              }
              return r.json()
          })
          .then(data =>setDosageHistories(data))  
  },[])

  const handleDH = (newDosageHx) =>{
    console.log(newDosageHx)
  }

  const handleEditedDh = (editedDh) => {
    setDosageHistories((prevDosageHistories) => {
      return prevDosageHistories.map((dh) =>
        dh.id === editedDh.id ? editedDh : dh
      );
    });
  };



  return (
    <>
      <NavBar user={user}/>

      <Routes>
        <Route path="/" element={<Home user={user} onLogin={onLogin}onLogOut={onLogOut} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={onLogin}/>} />
        <Route path="/users/:id" element={<User user={user} />} />
        <Route path="/prescriptions" element={<Prescription user={user} handleDH={handleDH} />} />
        <Route path="/doctors" element={<Doctor user={user} />} />
        <Route path="/dosage_history" element={<DosageHistory user={user} handleEditedDh={handleEditedDh} dosageHistories={dosageHistories} />} />


        {/* <Route path="/prescriptions/:id" element={<Prescription />} /> */}
      </Routes>
    </>
    )}

export default App;
