import React , {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import {Link} from 'react-router-dom'

function Login({onLogin}){
    const [username, setUsername]= useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const user = await response.json();
                onLogin(user);
                window.alert('Login successful')
                
            } else if (response.status === 401 || response.status === 500) {
                throw new Error('Invalid username or password');
            }
        } catch (error) {
            if (error.message === 'Invalid username or password') {
                window.alert('Invalid username or password. Please try again.');
                setUsername('')
                setPassword('')
            }
        }
    };
    
    return (
        <Container>
            <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username}
                        onChange={e => setUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={password}
                    onChange={e => setPassword(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                Submit
                </Button>

            </Form>
            Not a Member? 
            <Link to={"/signup"}>
            <Button variant="link">Sign up</Button>
            </Link>

        </Container>

      )}

export default Login
