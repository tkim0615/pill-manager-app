import React from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'

const NavBar = () => {
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Pill Manager</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
            
          <Nav.Link href="/">Prescriptions</Nav.Link> 
          <Nav.Link href="/doctors">Doctors</Nav.Link>
  
        </Nav>
      </Container>
    </Navbar>
    </>
)
}

export default NavBar

//user component that can edit user info