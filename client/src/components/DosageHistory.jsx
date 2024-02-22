import React, {useState, useEffect} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'

const DosageHistory = ({dosageHistories}) => {

    
    return (
        <Container>
            <h1>Your Dosage History</h1>
            <ListGroup>
                {dosageHistories.map((dh) => (
                    <ListGroup.Item key={dh.id}>
                            Date Taken : {dh.date_taken}
                            Drug Name: {dh.prescription_name}
                            Doctor: Dr. {dh.doctor_name}
                        <div>
                      </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    )
}

export default DosageHistory