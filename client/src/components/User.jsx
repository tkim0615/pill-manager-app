import { useParams } from "react-router-dom";
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
  const { id } = useParams();

    
  useEffect(() => {
    fetch(`/users/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setFetchedUser(data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, [id]);


  const handleSubmit = (e) =>{
    e.preventDefault()
    fetch(`/users/${user.id}`,{
      
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, password})
    })
      .then((r) => r.json())
      .then((editedUser) => {
        setFetchedUser(editedUser)
        setUsername('')
        setPassword('')
      })
      .catch((error) => console.error('Error:', error));
  };
  


  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>
          <h1>User account info</h1>
        </Card.Header>
        <Card.Body>
          <Card.Title>{fetchedUser.name}</Card.Title>
          <Card.Text>
            User: {fetchedUser.username}
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
                <Form.Control type="password" placeholder="Enter new password" value={password}
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

// 1. when account(navbar is clicked), `/users/${user.id}` user is the state set when user logs in
//2. inside user component fetch id that matches user's id from user state(user.id. use param) pass down user state as prop
//.2edit user ?(can be extra)