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
            <h1>Doctors</h1>
            <ListGroup>
                {doctors.map((md) => (
                    <ListGroup.Item style={{ border: '3px solid #b3d7ff', padding: '10px', borderRadius: '15px' }} key={md.id}>
                      <div>
                            <strong>Name:</strong> Dr. {md.name} 
                      </div>
                      <div>
                            <strong>Doctor Id:</strong> {md.id} 
                      </div>
                            
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    )
}

export default Doctor