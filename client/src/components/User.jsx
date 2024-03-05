import { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const User = ({user}) => {
  const [fetchedUser, setFetchedUser] = useState({})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  if(user === null){
    window.alert('Please login')
  }

  useEffect(() => {
    {user &&
    fetch(`/users/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setFetchedUser(data))
      .catch((error) => console.error("Error fetching user details:", error));
  }}, [user.id]);


  const handleSubmit = (e) =>{
    e.preventDefault()
    const requestBody = {
      ...(password && { password }), 
      ...(username && { username })
    }
    if (!password && !username) {
      
      alert("Please provide both (password or username).");
      return;
    }
    fetch(`/users/${user.id}`,{
      
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
    .then((r) => {
      if (!r.ok) {
          throw new Error('Unable to edit user info');
      }
      alert('User info edited successfully')
      return r.json()})

      .then((editedUser) => {
        setFetchedUser(editedUser)
        setUsername('')
        setPassword('')
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Unable to edit user info'); // Move alert here
    })
  }
  

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>
          <h1>User account info</h1>
        </Card.Header>
        <Card.Body>
          <Card.Title>Name: {fetchedUser.name}</Card.Title>
          <Card.Text>
            Username: {fetchedUser.username}
          </Card.Text>          
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <Form.Label>Edit account info</Form.Label>

                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>New Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter new username" value={username}
                        onChange={e => setUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="New Password. Must be 6 to 12 characters, contain lowercase and numbers" value={password}
                    onChange={e => setPassword(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                Submit
                </Button>

        </Form>
    </Container>
  )
  }

export default User
