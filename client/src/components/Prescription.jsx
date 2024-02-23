import React, { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import SideEffect from './SideEffect'
import PrescriptionForm from './PrescriptionForm'

const Prescription = ({user, handleDH}) => {
    const [prescriptions, setPrescriptions] = useState([])
    const [editIndex, setEditIndex] = useState(null)
    const [editedPrescription, setEditedPrescription] = useState(null)
    const [dosageHx, setDosageHx] = useState([])
    const [dhOn, setDhOn] = useState(false)

    useEffect(() => {
        // Function to fetch current user's prescriptions
        const fetchPrescriptions = async () => {
            try {
                const response = await fetch('/prescriptions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any necessary authorization headers if required
                    }
                  });

                if (!response.ok) {
                    throw new Error('Failed to fetch prescriptions');
                }

                const data = await response.json();
                setPrescriptions(data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error.message);
            }
        };

        fetchPrescriptions(); // Call the function to fetch prescriptions when the component mounts
    }, []); // The empty dependency array ensures this effect runs only once

    const handleEditClick = (prescription) =>{
      setEditIndex(prescription.id)
      setEditedPrescription(prescription)
    }


  const onSubmit = async (prescriptionData) => {
    
    try {
        let response;
        // Determine whether it's an edit or add operation
        if (editIndex !== null) {
            // Editing an existing prescription
            response = await fetch(`/prescriptions/${editIndex}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prescriptionData),
            });
        } else {
            // Adding a new prescription
            response = await fetch('/prescriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prescriptionData),
            });
        }

        if (!response.ok) {
            throw new Error('Failed to submit prescription');
        }

        const updatedPrescription = await response.json();
        console.log('Updated Prescription:', updatedPrescription);
        
        // Update the prescriptions state based on the operation
        if (editIndex !== null) {
            // Replace the edited prescription in the array
            const updatedPrescriptions = prescriptions.map((presc, index) => {
                return presc.id === editIndex ? updatedPrescription : presc;
            });
            setPrescriptions(updatedPrescriptions);
        } else {
            // Add the new prescription to the array
            setPrescriptions((prevPrescriptions) => [...prevPrescriptions, updatedPrescription]);
        }

        setEditIndex(null); // Reset edit mode
    } catch (error) {
        console.error('Error submitting prescription:', error.message);
    }
}

const handleDeleteRx = (deletedRx) => {
    fetch(`/prescriptions/${deletedRx.id}`, {
        method: 'DELETE',
    })
    .then((response) => {
        if (response.ok) {
            setPrescriptions(prescriptions.filter((rx) => rx.id !== deletedRx.id));
        }
    })
    .catch((error) => console.error("Error:", error));
  }

  const handleCreateDosageHistory = async (prescriptionId) => {
    const originalDate = new Date();
    const formattedDate = originalDate.toISOString().slice(0, 16).replace('T', ' ');
    console.log(formattedDate)

    try {
        const response = await fetch('/dosage_histories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date_taken: formattedDate, // Use the current date/time
                user_id: user.id,
                prescription_id: prescriptionId
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to create dosage history');
        }

        const createdDosageHistory = await response.json()
            handleDH(createdDosageHistory)
        // You can handle the created dosage history as needed
    } catch (error) {
        console.error('Error creating dosage history:', error.message);
    }
}

    const handleDhHx =(rxId) =>{
        setDhOn(dhOn=>!dhOn)
        console.log(rxId)
        fetch(`/dosage_histories_by_rx/${rxId}`)
            .then(r =>{
                if(!r.ok){
                    throw new Error('Failed to load dosage history')
                }else{
                    return r.json()
                }
            })
            .then(fetchedDh => setDosageHx(fetchedDh))
    }
    console.log(dosageHx)

    return (
        user?

        <Container>
            <h1>Prescriptions</h1>
            <ListGroup>
                {prescriptions.map((prescription, index) => (
                    <ListGroup.Item key={prescription.id} className="prescription-item">

                            <div className="prescription-details">
                                <div><strong>Name:</strong> {prescription.name}</div>
                                <div><strong>Direction:</strong> {prescription.direction}</div>
                                <div><strong>Start date:</strong> {prescription.start_date}</div>
                                <div><strong>End date:</strong> {prescription.end_date}</div>
                                <div><strong>Completed:</strong> {prescription.completed ? 'Yes' : 'No'}</div>
                                <div><strong>Doctor:</strong> Dr. {prescription.doctor_name}</div>
                            </div>
                            {dosageHx && dhOn ?
                                dosageHx
                                    .sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken))
                                    .map((dh) => (
                                        <ListGroup.Item key={dh.id}>
                                            <div>
                                                <strong>Date Taken:</strong> {dh.date_taken}
                                            </div>
                                            <div>
                                                <strong>Name:</strong> {dh.prescription_name}
                                            </div>
                                            <div>
                                                <strong>Doctor:</strong> Dr. {dh.doctor_name}
                                            </div>
                                        </ListGroup.Item>
                                    ))
                                : null
                            }

                            <div className="button-group">
                                <Button onClick={() => handleEditClick(prescription)} variant="outline-secondary" size="sm">
                                Edit
                                </Button>
                                <Button onClick={() => handleDeleteRx(prescription)} variant="outline-danger" size="sm">
                                Delete
                                </Button>
                                <Button onClick={()=> handleDhHx(prescription.id)} variant="outline-primary" size="sm">
                                See dosage history
                                </Button>
                                
                                <Button
                                onClick={() => handleCreateDosageHistory(prescription.id)}
                                variant="outline-primary"
                                size="sm"
                                >
                                Create Dosage History
                                </Button>
                            </div>
                            <div className="side-effect-button">
                                <SideEffect prescription={prescription} />
                            </div>


                    </ListGroup.Item>
                ))}

            </ListGroup>
                  
                {/* Conditionally render PrescriptionForm */}
                {editIndex !== null ? (
                    <PrescriptionForm user={user} editedPrescription={editedPrescription} onSubmit={onSubmit}
                    />
                ) : (
                    <PrescriptionForm user={user} onSubmit={onSubmit} />
                )}
        </Container>
        :
        null

    );
};

export default Prescription;
