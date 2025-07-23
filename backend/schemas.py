# schemas.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Pydantic model for the CarOwner response
class CarOwnerResponse(BaseModel):
    id: str
    name: str
    number_plate: str
    car_type: str
    phone_number: str
    check_in_time: datetime
    check_out_time: Optional[datetime] = None  # Optional, can be None
    checked_out: bool  # Boolean type to ensure the response is validated properly

    class Config:
        orm_mode = True  # Ensure that Pydantic model works with SQLAlchemy models
