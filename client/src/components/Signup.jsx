import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';


function Signup() {
const [fullName, setFullName] = useState('')
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')




const handleSubmit =(e) =>{
    e.preventDefault()
    console.log('helo')
}
  return (
    <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Label as="h2">Signup</Form.Label>

                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control type="text" placeholder="Enter full name"
                    onChange={e=>setFullName(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" 
                    onChange={e=>setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password"
                onChange={e=>setPassword(e.target.value)}

                 />
                </Form.Group>
                <Button variant="primary" type="submit">
                Submit
                </Button>
            </Form>
        </Container>
    )
}

export default Signup;
