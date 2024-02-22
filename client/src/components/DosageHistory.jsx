import React, {useState} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


const DosageHistory = ({dosageHistories, handleEditedDh}) => {
    const [editedId, setEditedId] = useState(null)
    const [timeTaken, setTimeTaken] = useState('')
    console.log(timeTaken)

    const handleEditClick = (editedDh) =>{
        setEditedId(editedDh.id)
    }
    const handleCancelEdit = () =>{
        setEditedId(null)
    }

    const handleSubmit =(e) =>{
        e.preventDefault()
        const editedTime = {
            date_taken: timeTaken
        }
        fetch(`/dosage_histories/${editedId}`,{
            method:'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(editedTime) 
        })
            .then(r =>{
                console.log(r)
                if (!r.ok) {
                    throw new Error('Failed to edit date taken');
                }else{
                    return r.json()
                }
            })
            .then(editedDh =>{
                handleEditedDh(editedDh)
                console.log(editedDh)
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });
            
            
    }
    
    return (
        <Container>
            <h1>Your Dosage History</h1>
            <ListGroup>
            {dosageHistories
                .sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken))
                .map((dh) => (
                    <ListGroup.Item key={dh.id}>
                        Date Taken: {dh.date_taken}
                        Drug Name: {dh.prescription_name}
                        Doctor: Dr. {dh.doctor_name}
                      <div>
                      </div>
                        <Button onClick={()=> handleEditClick(dh)} variant="outline-secondary" size="sm">Edit</Button>
                        {dh.id === editedId? 
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Edit time taken</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder="Enter YYYY-MM-DD HH:MM format"
                                value = {timeTaken}
                                onChange={e=>setTimeTaken(e.target.value)}
                                />
                                <Form.Text className="text">
                                </Form.Text>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        </Form>
                        : null
                    
                        }
                        
                    </ListGroup.Item>
                ))}
                
            </ListGroup>
        </Container>
    )
}

export default DosageHistory