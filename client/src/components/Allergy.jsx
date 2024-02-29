import React, {useState, useEffect} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'

function Allergy({allergies}){

console.log(allergies)

    return (
        <Container>
            <h1>Your drug allergies</h1>
            <ListGroup>
                {allergies.map((allergy) => (
                    <ListGroup.Item key={allergy.id}>
                    <div>
                            <strong>Drug:</strong> {allergy.drug_allergy} 
                    </div>
                    <div>
                            <strong>symptoms:</strong> {allergy.symptoms} 
                    </div>
                            
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    )
    }

export default Allergy