import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                window.alert('Login successful');

            } else if (response.status === 401 || response.status === 500) {
                throw new Error('Invalid username or password');
            }
        } catch (error) {
            if (error.message === 'Invalid username or password') {
                window.alert('Invalid username or password. Please try again.');
                setUsername('');
                setPassword('');
            }
        }
    };

    return (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center p-4 rounded shadow-sm">
                <h2 className="text-center mb-4">Sign In</h2>
                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username}
                        onChange={e => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password}
                        onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-3">
                    Login
                </Button>
                <p className="text-center mb-0">Not a Member? <Link to={"/signup"}>Sign up</Link></p>
            </Form>
        </div>
    );
}

export default Login;
