import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';


function Signup({onSignup, onSignedUp}) {
const [name, setName] = useState('')
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')


const handleSubmit =(e) =>{
    e.preventDefault()
    console.log('helo')
    fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, username, password}),
      })
      .then(r =>{
        if (r.ok){
            return r.json()
        } else if( r.status === 401 || r.status === 500 || r.status === 400){
            throw new Error('Invalid username or password')
        }
      })
      .then(user =>{
        onSignup(user)
        onSignedUp()
      })
      .catch(error =>{
        if(error.message === 'Invalid username or password'){
            window.alert('Invalid username or password. Please try again.')
        }
      })
}
  return (
    <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Label as="h2">Signup</Form.Label>

                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control type="text" placeholder="Enter full name"
                    onChange={e=>setName(e.target.value)}
                    value = {name}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" 
                    onChange={e=>setUsername(e.target.value)}
                    value = {username}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password"
                onChange={e=>setPassword(e.target.value)}
                value = {password}

                 />
                </Form.Group>
                <Button variant="primary" type="submit">
                Submit
                </Button>
            </Form>
        </Container>
    )}

export default Signup;
