import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import PrescriptionForm from './PrescriptionForm';

const Prescription = ({user, handleDH}) => {
    const [prescriptions, setPrescriptions] = useState([])
    const [editIndex, setEditIndex] = useState(null)
    const [editedPrescription, setEditedPrescription] = useState(null)

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
            setPrescriptions([...prescriptions, updatedPrescription]);
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



// do i need to call any function



    return (
        <Container>
            <h1>Prescriptions</h1>
            {/* Render your prescriptions here using the 'prescriptions' state */}
            <ListGroup>
                {prescriptions.map((prescription, index) => (
                    <ListGroup.Item key={prescription.id}>
                        {/* Display prescription details */}
                            name: {prescription.name}
                            direction: {prescription.direction}
                            Start date: {prescription.start_date}
                            End date: {prescription.end_date}
                            Completed? {prescription.completed.toString()}
                            Dr. {prescription.doctor_name}

                            <div>
                            <Button onClick={() => handleEditClick(prescription)} variant="outline-secondary" size="sm">
                                Edit
                            </Button>
                            <Button onClick={() => handleDeleteRx(prescription)} variant="outline-danger" size="sm">
                                Delete
                            </Button>
                            <Button
                                onClick={() => handleCreateDosageHistory(prescription.id)}
                                variant="outline-primary"
                                size="sm"
                            >
                                Create Dosage History
                            </Button>
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
    );
};

export default Prescription;
//conditionally render prescriptionForm component..with edit or add state