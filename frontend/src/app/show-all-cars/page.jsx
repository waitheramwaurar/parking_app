'use client'; // Important! because we are using state and events (Client Component)

import { useState, useEffect } from 'react';
import { showAllCars  } from '../../../utils/api';
import { useRouter } from 'next/navigation';

export default function ShowAllCarsPage() {
    const [carOwners, setCarOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchCarOwners() {
          try {
            const data = await showAllCars(); // <-- use the function here
            setCarOwners(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }

        fetchCarOwners();

        }, []);

        function handleRowClick(id) {
            router.push(`/car-owners/${id}`); // Navigate to the car owner details page
        }


        function handleGoToAddCarOwner() {
            router.push('/add-car-owner');
          }
        
          if (loading) {
            return <p>Loading...</p>;
          }

          return (
            <div style={{ padding: '20px' }}>
            <h1>All Car Owners</h1>

            {carOwners.length === 0 ? (
                    <p>No car owners found.</p>
                ) : (  
             
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid white', padding: '8px' }}>Name</th>
                    <th style={{ border: '1px solid white', padding: '8px' }}>Number Plate</th>
                    <th style={{ border: '1px solid white', padding: '8px' }}>Car Type</th>
                    <th style={{ border: '1px solid white', padding: '8px' }}>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {carOwners.map((owner) => (
                    <tr key={owner.id}
                      onClick={() => handleRowClick(owner.id)}
                      className="cursor-pointer hover:bg-gray-700">
                      <td style={{ border: '1px solid white', padding: '8px' }}>{owner.name}</td>
                      <td style={{ border: '1px solid white', padding: '8px' }}>{owner.number_plate}</td>
                      <td style={{ border: '1px solid white', padding: '8px' }}>{owner.car_type}</td>
                      <td style={{ border: '1px solid white', padding: '8px' }}>{owner.phone_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
                )}

                <button 
                    onClick={handleGoToAddCarOwner}
                    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Add New Car Owner
                </button>
            </div>

            
    );
};