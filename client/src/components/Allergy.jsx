import React, {useState, useEffect} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function Allergy({allergies, user, handleAllergySubmit, handleDeleteAllergy}){
    const [prescriptions, setPrescriptions] = useState([])
    const [allergyName, setAllergyName] = useState('')
    const [symptom, setSymptom] = useState('')

const rxNames = prescriptions.map(rx => rx.name.toLowerCase().split(' ')[0])
const allergieName = allergies.map(a => a.drug_allergy.toLowerCase().split(' ')[0])

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
            console.error('Error fetching prescriptions:', error.message)
        }}
    fetchPrescriptions()
}, [])

const handleSubmit = (e)=>{
    e.preventDefault()
    const newAllergy = {
        drug_allergy: allergyName,
        symptoms: symptom,
        user_id: user.id
    }
    handleAllergySubmit(newAllergy)
    setAllergyName('')
    setSymptom('')
}

    return (
        <Container>
            <h1>Drug allergies</h1>
            <ListGroup>
                {allergies.map((allergy) => (
                    <ListGroup.Item key={allergy.id}>
                    <div>
                            <strong>Drug:</strong> {allergy.drug_allergy} 
                    </div>
                    <div>
                            <strong>symptoms:</strong> {allergy.symptoms} 
                    </div>
                    
                    {uniqueAllergyArray.includes(allergy.drug_allergy.toLowerCase().split(' ')[0]) 
                    ? 
                    (
                        <Alert key={allergy.id} variant="danger">
                            WARNING: <strong>{allergy.drug_allergy}</strong> is in your prescription history. Please consult with a doctor.
                        </Alert>
                        ) 
                        : 
                        <Alert key={allergy.id} variant='success'>
                            You have no allergy interactions with your prescriptions.
                        </Alert>}
                        <Button onClick={() => handleDeleteAllergy(allergy)} variant="outline-danger" size="sm">
                                            Delete
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Form onSubmit={handleSubmit}>
                <h1>Add new drug allergy</h1>
                <Form.Group>
                    <Form.Label>Drug allergy:</Form.Label>
                    <Form.Control
                    type="text"
                    name="drug allergy"
                    value={allergyName}
                    onChange={e=> setAllergyName(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Symptom:</Form.Label>
                    <Form.Control
                    type="text"
                    name="symptom"
                    value={symptom}
                    onChange={e=> setSymptom(e.target.value)}
                    required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Add allergy
                </Button>
            </Form>
        </Container>
    )
    }

export default Allergy