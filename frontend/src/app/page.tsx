'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // ✅ import toast
import { Dialog } from '@headlessui/react'; // ✅ for modal (if you don't want Tailwind UI, I can show simple div modal)

interface CarOwner {
  id: number;
  name: string;
  number_plate: string;
  car_type: string;
  phone_number: string;
  check_in_time: string;
}

export default function CarsPage() {
  const [carOwners, setCarOwners] = useState<CarOwner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<CarOwner | null>(null);

  useEffect(() => {
    fetchCarOwners();
  }, []);

  const fetchCarOwners = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/car-owners/');
      const data = await res.json();
      setCarOwners(data);
    } catch (error) {
      console.error('Error fetching car owners:', error);
      toast.error('Failed to fetch car owners!');
    }
  };

  const openModal = (owner: CarOwner) => {
    setSelectedOwner(owner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOwner(null);
  };

  const updateOwner = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/car-owners/${selectedOwner?.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedOwner),
      });

      if (response.ok) {
        toast.success('Car info updated successfully! 🚗✅');
        fetchCarOwners();
        closeModal();
      } else {
        toast.error('Failed to update car info ❌');
      }
    } catch (error) {
      console.error('Error updating car owner:', error);
      toast.error('An unexpected error occurred ⚡');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster /> {/* ✅ Toast messages container */}

      <h1 className="text-3xl font-bold mb-8 text-start text-gray-800">Parking List</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Number Plate</th>
              <th className="py-3 px-6 text-left">Type of Car</th>
              <th className="py-3 px-6 text-left">Phone Number</th>
              <th className="py-3 px-6 text-left">Check-in Time</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {carOwners.map((owner) => (
              <tr key={owner.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{owner.name}</td>
                <td className="py-3 px-6 text-left">{owner.number_plate}</td>
                <td className="py-3 px-6 text-left">{owner.car_type}</td>
                <td className="py-3 px-6 text-left">{owner.phone_number}</td>
                <td className="py-3 px-6 text-left">
                  {owner.check_in_time ? new Date(owner.check_in_time).toLocaleString() : 'N/A'}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => openModal(owner)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-4">Edit Car Owner</Dialog.Title>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 rounded"
                value={selectedOwner?.name || ''}
                onChange={(e) => setSelectedOwner({ ...selectedOwner!, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Number Plate"
                className="w-full border p-2 rounded"
                value={selectedOwner?.number_plate || ''}
                onChange={(e) => setSelectedOwner({ ...selectedOwner!, number_plate: e.target.value })}
              />
              <input
                type="text"
                placeholder="Type of Car"
                className="w-full border p-2 rounded"
                value={selectedOwner?.car_type || ''}
                onChange={(e) => setSelectedOwner({ ...selectedOwner!, car_type: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border p-2 rounded"
                value={selectedOwner?.phone_number || ''}
                onChange={(e) => setSelectedOwner({ ...selectedOwner!, phone_number: e.target.value })}
              />

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={updateOwner}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
