// utils/api.js

export async function addCarOwner(data) {
    const response = await fetch('https://parkingapp-production-1068.up.railway.app/car-owners/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to add car owner');
    }
  
    return await response.json();
  }
  
  export async function showAllCars() {
    const response = await fetch('https://parkingapp-production-1068.up.railway.app/car-owners/');
  
    if (!response.ok) {
      throw new Error('Failed to fetch car owners');
    }
  
    return await response.json();
  }