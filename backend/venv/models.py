from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime

class CarOwner(Base):
    __tablename__ = "car_owners"

    id = Column(String, primary_key=True, index=True)
    check_in_time = Column(DateTime, default=datetime.utcnow)
    name = Column(String, index=True)
    number_plate = Column(String)
    car_type = Column(String)
    phone_number = Column(String)
