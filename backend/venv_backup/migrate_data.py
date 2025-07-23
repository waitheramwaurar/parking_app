from sqlalchemy.orm import Session
from models import CarOwner, SessionLocal
from datetime import datetime

# Create a session to interact with the database
db = SessionLocal()

# Sample data to insert
car_owners_data = [
    {
        "id": "1",
        "name": "John Doe",
        "number_plate": "ABC123",
        "car_type": "Sedan",
        "phone_number": "123-456-7890",
        "check_in_time": datetime(2025, 4, 29, 10, 0),  # Sample check-in time
        "checked_out": False
    },
    {
        "id": "2",
        "name": "Jane Smith",
        "number_plate": "XYZ789",
        "car_type": "SUV",
        "phone_number": "987-654-3210",
        "check_in_time": datetime(2025, 4, 28, 14, 30),  # Sample check-in time
        "checked_out": True,
        "check_out_time": datetime(2025, 4, 29, 12, 0)  # Sample check-out time
    },
]

# Function to add car owners
def add_car_owners():
    for data in car_owners_data:
        car_owner = CarOwner(**data)
        db.add(car_owner)
    db.commit()

# Add the car owners data to the database
add_car_owners()
print("Data migration complete.")

# Close the session
db.close()
