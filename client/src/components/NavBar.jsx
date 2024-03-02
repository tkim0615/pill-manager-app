import React from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import pill_emoji from '../pill_emoji.png'

const NavBar = ({user}) => {
  const handleNotLoggedIn = () => {
    window.alert('Please login to access this feature.');
}
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark" className="pill-navbar">
      <Container>
        <Navbar.Brand href="/">Pill Manager <img src={pill_emoji} alt="Pill Emoji" style={{ width: '30px', height: '40px', backgroundColor: 'transparent'}}/>
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to={user ? '/prescriptions' : '/'} onClick={user ? null : handleNotLoggedIn}>
              Prescriptions
            </Nav.Link>      
            <Nav.Link as={Link} to={user ? '/dosage_history' : '/'} onClick={user ? null : handleNotLoggedIn}>
            Dosage Tracker
            </Nav.Link>
            <Nav.Link as={Link} to={user ? '/allergy' : '/'} onClick={user ? null : handleNotLoggedIn}>
              Allergy
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