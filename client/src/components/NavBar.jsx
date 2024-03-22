import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import pillEmoji from '../pill_emoji.png';
import pillPile from '../pillPile.jpg';

const NavBar = ({ user }) => {
    const handleNotLoggedIn = () => {
        window.alert('Please login to access this feature.');
    };

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${pillPile})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '19px', // Adjust height as needed
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    
                }}
            >
                <h1 style={{ color: 'black' }}>Welcome to Pill Manager</h1>
            </div>

            <Navbar bg="dark" data-bs-theme="dark" className="pill-navbar">
                <Container>
                    <Navbar.Brand href="/">
                        Pill Manager <img src={pillEmoji} alt="Pill Emoji" style={{ width: '30px', height: '40px', backgroundColor: 'transparent' }} />
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to={user ? '/prescriptions' : '/'} onClick={user ? null : handleNotLoggedIn}>
                            Prescriptions
                        </Nav.Link>
                        <Nav.Link as={Link} to={user ? '/dosage_history' : '/'} onClick={user ? null : handleNotLoggedIn}>
                            Dosage Tracker
                        </Nav.Link>
                        <Nav.Link as={Link} to={user ? '/allergy' : '/'} onClick={user ? null : handleNotLoggedIn}>
                            Allergy
                        </Nav.Link>
                        <Nav.Link as={Link} to={user ? '/doctors' : '/'} onClick={user ? null : handleNotLoggedIn}>
                            Doctors
                        </Nav.Link>
                        {user && (
                            <Nav.Link as={Link} to={`/users/${user?.id}`}>
                                Account
                            </Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;
