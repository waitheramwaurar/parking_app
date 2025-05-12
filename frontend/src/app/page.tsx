'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

interface CarOwner {
  id: string;
  name: string;
  number_plate: string;
  car_type: string;
  phone_number: string;
  check_in_time: string;
  checked_out: boolean;
}

export default function CarsPage() {
  const [carOwners, setCarOwners] = useState<CarOwner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<CarOwner | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCarOwners();
    const interval = setInterval(fetchCarOwners, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCarOwners = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/car-owners/');
      const data = await res.json();
      setCarOwners(data);
    } catch (error) {
      toast.error('Failed to fetch car owners!');
    }
  };

  const saveOwner = async () => {
    try {
      const isNew = selectedOwner?.id === '';
      const url = isNew
        ? 'http://127.0.0.1:8000/car-owners/'
        : `http://127.0.0.1:8000/car-owners/${selectedOwner?.id}/`;

      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedOwner),
      });

      if (res.ok) {
        toast.success(isNew ? 'Created successfully' : 'Updated successfully');
        fetchCarOwners();
        closeModal();
      } else {
        toast.error(`${isNew ? 'Creation' : 'Update'} failed`);
      }
    } catch {
      toast.error(`Error ${selectedOwner?.id ? 'updating' : 'creating'} car owner`);
    }
  };

  const checkoutOwner = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/car-owners/${id}/checkout`, {
        method: 'PATCH',
      });
      if (res.ok) {
        toast.success('Checked out successfully');
        fetchCarOwners();
      } else {
        toast.error('Checkout failed');
      }
    } catch {
      toast.error('Error during checkout');
    }
  };

  const getDuration = (checkIn: string): string => {
    const diffMs = new Date().getTime() - new Date(checkIn).getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getCost = (checkIn: string, checkedOut: boolean): string => {
    if (checkedOut) return 'Finalized';
    const diffMs = new Date().getTime() - new Date(checkIn).getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    return `${hours * 100} KES`;
  };

  const openModal = (owner: CarOwner) => {
    setSelectedOwner(owner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOwner(null);
  };

  const filteredOwners = carOwners.filter(o =>
    o.number_plate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 text-xs sm:text-sm md:text-base">
      <Toaster />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Parking List</h1>
        <input
          type="text"
          placeholder="Search by plate"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <button
          onClick={() => {
            setSelectedOwner({
              id: '',
              name: '',
              number_plate: '',
              car_type: '',
              phone_number: '',
              check_in_time: new Date().toISOString(),
              checked_out: false,
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Car Owner
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Number Plate</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Check-In</th>
              <th className="py-2 px-4 text-left">Duration</th>
              <th className="py-2 px-4 text-left">Cost</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {filteredOwners.map(owner => (
              <tr key={owner.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-2 px-4">{owner.name}</td>
                <td className="py-2 px-4">{owner.number_plate}</td>
                <td className="py-2 px-4">{owner.car_type}</td>
                <td className="py-2 px-4">{owner.phone_number}</td>
                <td className="py-2 px-4">
                  {new Date(owner.check_in_time).toLocaleString()}
                </td>
                <td className="py-2 px-4">{getDuration(owner.check_in_time)}</td>
                <td className="py-2 px-4">{getCost(owner.check_in_time, owner.checked_out)}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  <button
                    onClick={() => openModal(owner)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  {!owner.checked_out && (
                    <button
                      onClick={() => checkoutOwner(owner.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Checkout
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg text-sm">
            <Dialog.Title className="text-lg font-bold mb-4">
              {selectedOwner?.id ? 'Edit Car Owner' : 'New Car Owner'}
            </Dialog.Title>
            <div className="space-y-4">
              <input type="text" placeholder="Name" className="w-full border p-2 rounded"
                value={selectedOwner?.name || ''}
                onChange={e => setSelectedOwner({ ...selectedOwner!, name: e.target.value })} />
              <input type="text" placeholder="Number Plate" className="w-full border p-2 rounded"
                value={selectedOwner?.number_plate || ''}
                onChange={e => setSelectedOwner({ ...selectedOwner!, number_plate: e.target.value })} />
              <input type="text" placeholder="Type of Car" className="w-full border p-2 rounded"
                value={selectedOwner?.car_type || ''}
                onChange={e => setSelectedOwner({ ...selectedOwner!, car_type: e.target.value })} />
              <input type="text" placeholder="Phone Number" className="w-full border p-2 rounded"
                value={selectedOwner?.phone_number || ''}
                onChange={e => setSelectedOwner({ ...selectedOwner!, phone_number: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={saveOwner}>
                  Save
                </button>
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={closeModal}>
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