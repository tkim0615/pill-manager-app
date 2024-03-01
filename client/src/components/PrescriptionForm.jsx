import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const PrescriptionForm = ({ onSubmit, user, editedPrescription}) => {
  const [prescription, setPrescription] = useState({
    name: '',
    direction: '',
    start_date: '',
    end_date: '',
    completed: false,
    doctor_id: '',
    image:''
  })
  console.log(prescription)

  useEffect(() => {
    if (editedPrescription) {
        setPrescription(editedPrescription);
    }
}, [editedPrescription]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrescription((prevPrescription) => ({
      ...prevPrescription,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prescription)
    setPrescription({
        name: '',
        direction: '',
        start_date: '',
        end_date: '',
        completed: false,
        doctor_id: '',
        image: ''
      });

  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Prescription Name */}
      <Form.Group>
        <Form.Label>Prescription Name:</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={prescription.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Prescription Direction */}
      <Form.Group>
        <Form.Label>Direction:</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="direction"
          value={prescription.direction}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Start Date */}
      <Form.Group>
        <Form.Label>Start Date:</Form.Label>
        <Form.Control
          type="date"
          name="start_date"
          value={prescription.start_date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* End Date */}
      <Form.Group>
        <Form.Label>End Date:</Form.Label>
        <Form.Control
          type="date"
          name="end_date"
          value={prescription.end_date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Completed Checkbox */}
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Completed"
          name="completed"
          checked={prescription.completed}
          onChange={handleChange}
        />
      </Form.Group>



      {/* Doctor ID */}
      <Form.Group>
        <Form.Label>Doctor ID:</Form.Label>
        <Form.Control
          type="number"
          name="doctor_id"
          value={prescription.doctor_id}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Image url:</Form.Label>
        <Form.Control
          type="text"
          name="image"
          value={prescription.image}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Submit Button */}
      <Button variant="primary" type="submit">
        Add Prescription
      </Button>
    </Form>
  );
};

export default PrescriptionForm;
