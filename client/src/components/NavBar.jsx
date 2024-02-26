import React from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavBar = ({user}) => {
  const handleNotLoggedIn = () => {
    window.alert('Please login to access this feature.');
}
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Pill Manager</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to={user ? '/prescriptions' : '/'} onClick={user ? null : handleNotLoggedIn}>
              Prescriptions
            </Nav.Link>      
            <Nav.Link as={Link} to={user ? '/dosage_history' : '/'} onClick={user ? null : handleNotLoggedIn}>
            Dosage Tracker
            </Nav.Link>
            <Nav.Link as={Link} to={user? "/doctors": "/"} onClick={user ? null : handleNotLoggedIn}>Doctors</Nav.Link>
            {user && <Nav.Link as={Link} to={`/users/${user?.id}`}>
              Account
            </Nav.Link>}
        </Nav>
      </Container>
    </Navbar>
    </>
)
}

export default NavBar

//user component that can edit user info