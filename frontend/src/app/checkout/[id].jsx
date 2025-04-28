'use client'; // Important! because we are using state and events (Client Component)

import { useState, useEffect } from 'react';
import { checkout  } from '../../../utils/api';
import { useParams } from 'react-router-dom'; 
// import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { id } = useParams();
    const [carOwner, setCarOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentReceived, setPaymentReceived] = useState(false);

    useEffect(() => {
        async function fetchCarOwner() {
        try {
            const data = await checkout(id);
            setCarOwner(data);
        } catch (error) {
            console.error('Error fetching car owner:', error);
        } finally {
            setLoading(false);
        }
        }

        if (id) {
        fetchCarOwner();
        }
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!carOwner) {
        return <p>Car Owner not found.</p>;
    }

    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="mb-4">
            <p><strong>Name:</strong> {carOwner.name}</p>
            <p><strong>Number Plate:</strong> {carOwner.number_plate}</p>
            <p><strong>Car Type:</strong> {carOwner.car_type}</p>
            <p><strong>Phone Number:</strong> {carOwner.phone_number}</p>
            <p><strong>Amount Due:</strong> KES 300 </p> {/* Hardcoded for now */}
        </div>

        <div className="flex items-center">
            <input 
            type="checkbox" 
            id="paymentReceived" 
            checked={paymentReceived} 
            onChange={(e) => setPaymentReceived(e.target.checked)}
            className="mr-2"
            />
            <label htmlFor="paymentReceived" className="text-lg">Payment Received</label>
        </div>
        </div>
  );
};