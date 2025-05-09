// utils/api.js

export async function addCarOwner(data) {
    const response = await fetch('http://127.0.0.1:8000/car-owners/', {
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
    const response = await fetch('http://127.0.0.1:8000/car-owners/');
  
    if (!response.ok) {
      throw new Error('Failed to fetch car owners');
    }
  
    return await response.json();
  }