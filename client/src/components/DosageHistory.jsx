import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const DosageHistory = ({ dosageHistories, handleEditedDh }) => {
    const [editedId, setEditedId] = useState(null);
    const [timeTaken, setTimeTaken] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const handleEditClick = (editedDh) => {
        setEditedId(editedDh.id);
    };

    const handleCancelEdit = () => {
        setEditedId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const editedTime = {
            date_taken: timeTaken,
        };
        fetch(`/dosage_histories/${editedId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedTime),
        })
            .then((r) => {
                if (!r.ok) {
                    throw new Error('Failed to edit date taken');
                } else {
                    return r.json();
                }
            })
            .then((editedDh) => {
                handleEditedDh(editedDh);
                console.log(editedDh);
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dosageHistories
        .sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken))
        .slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container>
            <h1>Dosage History</h1>
            <ListGroup>
                {currentItems.map((dh) => (
                    <ListGroup.Item key={dh.id} style={{ border: '3px solid #b3d7ff', padding: '10px', borderRadius: '15px' }}>
                        <div>
                            <strong>Date Taken:</strong> {dh.date_taken.slice(0, -3)}
                        </div>
                        <div>
                            <strong>Name:</strong> {dh.prescription_name}
                        </div>
                        <div>
                            <strong>Doctor:</strong> Dr. {dh.doctor_name}
                        </div>

                        <Button onClick={() => handleEditClick(dh)} variant="outline-secondary" size="sm">
                            Edit
                        </Button>
                        {dh.id === editedId ? (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Edit time taken</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter YYYY-MM-DD HH:MM format"
                                        value={timeTaken}
                                        onChange={(e) => setTimeTaken(e.target.value)}
                                    />
                                    <Form.Text className="text"></Form.Text>
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            </Form>
                        ) : null}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <div>
                {Array.from({ length: Math.ceil(dosageHistories.length / itemsPerPage) }).map((_, index) => (
                    <Button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                        style={{ margin: '5px' }}
                    >
                        {index + 1}
                    </Button>
                ))}
            </div>
        </Container>
    );
};

export default DosageHistory;
