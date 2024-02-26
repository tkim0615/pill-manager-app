import React, { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import SideEffect from './SideEffect'
import PrescriptionForm from './PrescriptionForm'
import PrescriptionProgressBar from './PrescriptionProgressBar'

const Prescription = ({user, handleDH, handleDeleteDh}) => {
    const [prescriptions, setPrescriptions] = useState([])
    const [totalDose, setTotalDose] = useState(0)
    const [editIndex, setEditIndex] = useState(null)
    const [editedPrescription, setEditedPrescription] = useState(null)
    const [dosageHx, setDosageHx] = useState([])
    const [dhOn, setDhOn] = useState(false)
    const [rxId, setRxId] = useState(null)

    useEffect(() => {
        // Function to fetch current user's prescriptions
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
        };

        fetchPrescriptions()
    }, [])

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
            throw new Error('Failed to submit prescription')
        }

        const updatedPrescription = await response.json()
        console.log('Updated Prescription:', updatedPrescription)
        
        // Update the prescriptions state based on the operation
        if (editIndex !== null) {
            // Replace the edited prescription in the array
            const updatedPrescriptions = prescriptions.map((presc) => {
                return presc.id === editIndex ? updatedPrescription : presc
            });
            setPrescriptions(updatedPrescriptions);
        } else {
            // for Post - Add the new prescription to the array
            setPrescriptions((prevPrescriptions) => [...prevPrescriptions, updatedPrescription])
        }

        setEditIndex(null)// Reset edit mode
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

    // const handleDhHx =(rxId) =>{
    //     setDhOn(dhOn=>!dhOn)
    //     setRxId(rxId)
    //     console.log(rxId)
    //     // if()
    //     fetch(`/dosage_histories_by_rx/${rxId}`)
    //         .then(r =>{
    //             if(!r.ok){
    //                 throw new Error('Failed to load dosage history')
    //             }else{
    //                 return r.json()
    //             }})
    //         .then(fetchedDh => setDosageHx(fetchedDh))
    // }

    const handleDhHx = (rxId) => {
        setDhOn(dhOn => !dhOn);
        setRxId(rxId);
        setDosageHx([]);

        
        fetch(`/dosage_histories_by_rx/${rxId}`)
            .then(r => {
                if (!r.ok) {
                    throw new Error('Failed to load dosage history');
                } else {
                    return r.json();
                }
            })
            .then(fetchedDh => {
                setDosageHx(fetchedDh);
    
                // Check if fetchedDh is empty and show an alert
                if (fetchedDh.length === 0) {
                    alert('No dosage history available.');
                    setDhOn(false)
                }
            })
            .catch(error => {
                console.error('Error:', error)
                // Handle error as needed, e.g., show an error message
            })
    }
    
    console.log(dosageHx)

    // const handleDhDelete =(dh) =>{
    //     fetch(`/dosage_histories/${dh.id}`,{
    //         method: 'DELETE',
    //         })
    //         .then(r =>{
    //             if(r.ok){
    //                 const filteredDh = dosageHx.filter(d =>d.id !== dh.id)
    //                 setDosageHx(filteredDh)
    //                 handleDeleteDh(dh)
    //         }})
    //         .catch((error) => console.error("Error:", error))
    //     }

    const handleDhDelete = async(dh) => {
        try{
        const response = await fetch(`/dosage_histories/${dh.id}`,{
                    method: 'DELETE',
                    })
        const data = await response.json()
        if (!response.ok){
            throw new Error ('Error deleting dosage history')
        }
        else{
            const filteredDh = dosageHx.filter(d =>d.id !== dh.id)
            setDosageHx(filteredDh)
        }}
        catch(error){
            console.error('there was a problem', error.message)
        }

    }







        const calculateTotalDosage = (prescription) => {
            const startDate = new Date(prescription.start_date)
            const endDate = new Date(prescription.end_date)
            const durationInDays = (endDate - startDate) / (24 * 60 * 60 * 1000) + 1
        
            // Declare dosageMultiplier outside the if statements
            let dosageMultiplier = 1
        
            // Adjust total dosage based on the direction
            if (prescription.direction.includes('once')) {
                dosageMultiplier = 1
            } else if (prescription.direction.includes('twice')) {
                dosageMultiplier = 2
            } else if (prescription.direction.includes('three')) {
                dosageMultiplier = 3
            }
        
            return durationInDays * dosageMultiplier;
        };





    return (
        user?

        <Container>
            <h1>Prescriptions</h1>
            <ListGroup>
                {prescriptions.map((prescription) => (
                    <ListGroup.Item key={prescription.id} className="prescription-item">


                            <div className="prescription-details">
                                <div><strong>Name:</strong> {prescription.name}</div>
                                <div><strong>Direction:</strong> {prescription.direction}</div>
                                <div><strong>Start date:</strong> {prescription.start_date}</div>
                                <div><strong>End date:</strong> {prescription.end_date}</div>
                                <div><strong>Completed:</strong> {prescription.completed ? 'Yes' : 'No'}</div>
                                <div><strong>Doctor:</strong> Dr. {prescription.doctor_name}</div>
                            </div>

                            <div className="button-group">
                                <Button onClick={() => handleEditClick(prescription)} variant="outline-secondary" size="sm">
                                Edit
                                </Button>
                                <Button onClick={() => handleDeleteRx(prescription)} variant="outline-danger" size="sm">
                                Delete
                                </Button>
                                <Button onClick={()=> handleDhHx(prescription.id)} variant="outline-primary" size="sm">
                                {dhOn && prescription.id === rxId? 'Close dosage history': 'See dosage history'}
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
                            <PrescriptionProgressBar
                                dosageTaken={dosageHx.filter((dh) => dh.prescription_id === prescription.id).length}
                                totalDose={calculateTotalDosage(prescription)}
                            />

                            
                            <div className="dosage-history-list" >
                                {dosageHx && dhOn && rxId === prescription.id ?
                                    dosageHx
                                        .sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken))
                                        .map((dh) => (
                                            <div key={dh.id} style={{ border: '4px solid yellow'}}>
                                                <ListGroup.Item >
                                                    <div>
                                                        <strong>Date Taken:</strong> {dh.date_taken.slice(0, -3)} 
                                                    </div>
                                                    <div>
                                                        <strong>Name:</strong> {dh.prescription_name}
                                                    </div>
                                                    <div>
                                                        <strong>Doctor:</strong> Dr. {dh.doctor_name}
                                                    </div>
                                                    <Button onClick={()=>handleDhDelete(dh)} variant="outline-danger" size="sm">
                                                        Delete
                                                    </Button>
                                                </ListGroup.Item>
                                            </div>
                                        ))
                                    : null
                                }
                            </div>

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
