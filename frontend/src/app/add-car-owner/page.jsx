'use client'; // Important! because we are using state and events (Client Component)

import { useState } from 'react';
import { addCarOwner } from '../../../utils/api';

export default function AddCarOwnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    number_plate: '',
    car_type: '',
    phone_number: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCarOwner(formData);
      alert('Car owner added successfully!');
      setFormData({
        name: '',
        number_plate: '',
        car_type: '',
        phone_number: '',
      });
    } catch (error) {
      console.error(error);
      alert('Failed to add car owner');
    }
  };

  return (
    <div>
      <h1>Add Car Owner</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          type="text"
          name="number_plate"
          placeholder="Number Plate"
          value={formData.number_plate}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          type="text"
          name="car_type"
          placeholder="Car Type"
          value={formData.car_type}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          Add Car Owner
        </button>
      </form>
    </div>
  );
}
