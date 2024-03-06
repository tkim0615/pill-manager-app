import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'
import User from './User'
import Prescription from './Prescription'
import Doctor from './Doctor'
import DosageHistory from './DosageHistory'
import Allergy from './Allergy'


function App() {
  const [user, setUser] = useState(null)
  const [dosageHistories, setDosageHistories] = useState([])
  const [allergies, setAllergies] = useState([])

  useEffect(() => {
    fetch('/check_session')
      .then((r) => {
        if (!r.ok) {
          throw new Error('Session check failed')
        }
        return r.json()
      })
      .then((user) => setUser(user))
      .catch(() => setUser(null))
  }, [])


  const onLogin =(user) =>{
    setUser(user)
    }

    const onLogOut = ()=>{
      setUser(null)
    }

    useEffect(() => {
      if (user) {
        fetch('/dosage_histories')
          .then(r => {
            if (!r.ok) {
              throw new Error('Failed to load dosage history')
            }
            return r.json()
          })
          .then(data => setDosageHistories(data))
          .catch(error => console.error('Error fetching dosage history:', error));
      }
    }, [user]) // This dependency ensures the effect runs when 'user' changes


    useEffect(() => {
      if (user) {
        fetch('/allergies')
          .then(r => {
            if (!r.ok) {
              throw new Error('Failed to load dosage history')
            }
            return r.json()
          })
          .then(data => setAllergies(data))
          .catch(error => console.error('Error fetching allergies:', error));
      }
    }, [user])
    

  const handleDH = (newDosageHx) =>{
    setDosageHistories([...dosageHistories, newDosageHx])
  }

  const handleDeleteDh =(deletedDh) =>{
    const filteredDh = dosageHistories.filter(dh => dh.id !== deletedDh.id)
    setDosageHistories(filteredDh)
  }

  const handleEditedDh = (editedDh) => {
    console.log(editedDh)
    setDosageHistories((prevDosageHistories) => {
      return prevDosageHistories.map((dh) =>
        dh.id === editedDh.id ? editedDh : dh
      )
    })
  }



  const handleAllergySubmit = (newAllergy) => {
    fetch('/allergies',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAllergy),
    })
      .then(r=>{
        if(r.status === 201){
        return r.json()
      }else{
        throw new Error('failed to post new allergy')
      }})
      .then(newAllergy => {
        setAllergies([...allergies, newAllergy])
      })
  }


  const handleDeleteAllergy = (deletedAllergy) => {
    fetch(`/allergies/${deletedAllergy.id}`, {
        method: 'DELETE',
    })
    .then((response) => {
        if (response.ok) {
            setAllergies(allergies.filter((allergy) => allergy.id !== deletedAllergy.id))
        }
    })
    .catch((error) => console.error("Error:", error))
  }

  return (
    <>
      <NavBar user={user}/>

      <Routes>
        <Route path="/" element={<Home user={user} onLogin={onLogin}onLogOut={onLogOut} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={onLogin}/>} />
        <Route path="/users/:id" element={<User user={user} />} />
        <Route path="/prescriptions" element={<Prescription user={user} handleDH={handleDH} handleDeleteDh={handleDeleteDh} />} />
        <Route path="/doctors" element={<Doctor user={user} />} />
        <Route path="/dosage_history" element={<DosageHistory user={user} handleEditedDh={handleEditedDh} dosageHistories={dosageHistories} />} />
        <Route path="/allergy" element={<Allergy user={user} allergies={allergies} handleAllergySubmit={handleAllergySubmit} handleDeleteAllergy={handleDeleteAllergy}/>} />
      </Routes>

    </>
      )}

export default App
