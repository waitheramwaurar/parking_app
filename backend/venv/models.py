from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Define the base class for SQLAlchemy models
Base = declarative_base()

# Database URL for SQLite
DATABASE_URL = "sqlite:///./car_owners.db"

# Define the CarOwner model
class CarOwner(Base):
    __tablename__ = "car_owners"

    id = Column(String, primary_key=True, index=True)
    check_in_time = Column(DateTime, default=datetime.utcnow)  # Set to current UTC time by default
    check_out_time = Column(DateTime, nullable=True)
    name = Column(String, index=True)
    number_plate = Column(String, index=True)
    car_type = Column(String)
    phone_number = Column(String)
    checked_out = Column(Boolean, default=False)  # Default to False

# Create the SQLite engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create the database tables
Base.metadata.create_all(bind=engine)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

