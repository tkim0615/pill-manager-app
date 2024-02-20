import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';



const User = ({user}) => {
  const [fetchedUser, setFetchedUser] = useState({})
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
    </Container>
  )
}

export default User

// 1. when account(navbar is clicked), `/users/${user.id}` user is the state set when user logs in
//2. inside user component fetch id that matches user's id from user state(user.id. use param) pass down user state as prop
//.2edit user ?(can be extra)