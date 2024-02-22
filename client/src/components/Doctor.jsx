import React, {useState, useEffect} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'

function Doctor({user}) {
    const [doctors, setDoctors] = useState([])

    useEffect(() => {
      {user &&
        fetch('/doctors')
          .then((r) => {
            if (!r.ok) {
              throw new Error('Failed to load doctors');
            }
            return r.json();
          })
          .then((data) => setDoctors(data))
      }}, [])

      return (
        <Container>
            <h1>Your doctors</h1>
            <ListGroup>
                {doctors.map((md) => (
                    <ListGroup.Item key={md.id}>
                            Name: Dr. {md.name}
                            Doctor ID: {md.id}
                        <div>
                      </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    )
}

export default Doctor