import React from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import { Link } from 'react-router-dom';

const NavBar = ({user}) => {
  console.log(user)
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Pill Manager</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link as={Link} to={{ pathname: '/prescriptions', state: { user } }}>
              Prescriptions
            </Nav.Link>      
            <Nav.Link href="/dosage_history">Dosage Tracker</Nav.Link>
            <Nav.Link href="/doctors">Doctors</Nav.Link>
            <Nav.Link as={Link} to={`/users/${user?.id}`}>
              Account
            </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    </>
)
}

export default NavBar

//user component that can edit user info