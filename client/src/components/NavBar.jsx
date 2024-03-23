

import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaPrescriptionBottleAlt, FaHistory, FaAllergies, FaUserMd, FaUser } from 'react-icons/fa';

const NavBar = ({ user }) => {
    const handleNotLoggedIn = () => {
        window.alert('Please login to access this feature.');
    };

    return (
        <Navbar bg="white" variant="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Pill Manager
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            <FaHome /> Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/prescriptions">
                            <FaPrescriptionBottleAlt /> Prescriptions
                        </Nav.Link>
                        <Nav.Link as={Link} to="/dosage_history">
                            <FaHistory /> Dosage Tracker
                        </Nav.Link>
                        <Nav.Link as={Link} to="/allergy">
                            <FaAllergies /> Allergy
                        </Nav.Link>
                        <Nav.Link as={Link} to="/doctors">
                            <FaUserMd /> Doctors
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {user ? (
                            <Nav.Link as={Link} to={`/users/${user.id}`}>
                                <FaUser /> Account
                            </Nav.Link>
                        ) : (
                            <Nav.Link onClick={handleNotLoggedIn}>
                                <FaUser /> Login
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
