import React, {useState, useEffect} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert';


function Allergy({allergies}){
    const [prescriptions, setPrescriptions] = useState([])

const rxNames = prescriptions.map(rx => rx.name)
const allergieName = allergies.map(a => a.drug_allergy)

const allergyMatch = rxNames.filter(rx => allergieName.includes(rx))
const uniqueAllergy = new Set(allergyMatch)
const uniqueAllergyArray = Array.from(uniqueAllergy)


useEffect(() => {
    const fetchPrescriptions = async () => {
        try {
            const response = await fetch('/prescriptions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
              })

            if (!response.ok) {
                throw new Error('Failed to fetch prescriptions');
            }

            const data = await response.json();
            setPrescriptions(data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error.message);
        }
    }
    fetchPrescriptions()
}, [])






 const alert = [
    'warning'
  ].map((variant) => (
    <Alert key={variant} variant={variant}>
      This is a {variant} alert—check it out!
    </Alert>
  ))

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
                    
                    {uniqueAllergyArray.includes(allergy.drug_allergy) ? (
                        <Alert key={allergy.id} variant="danger">
                            You have a history {allergy.drug_allergy} allergic reaction. Please consult with a doctor.
                        </Alert>
                        ) 
                        : 
                        <Alert key={allergy.id} variant='success'>
                            You have no allergy interactions with your prescriptions.
                        </Alert>}

                            
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    )
    }

export default Allergy