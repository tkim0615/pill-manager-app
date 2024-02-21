import React, {useState, useEffect} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'

const DosageHistory = () => {
    const [dosageHistories, setDosageHistories] = useState([])
    console.log(dosageHistories)

    useEffect(()=>{
        fetch('/dosage_histories')
            .then(r =>{
                if (!r.ok){
                    throw new Error('Failed to load dosage history')
                }
                return r.json()
            })
            .then(data =>setDosageHistories(data))  
    },[])

    
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