from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# SQLite URL
# SQLALCHEMY_DATABASE_URL = "sqlite:///./car_owners.db"
DATABASE_URL = os.getenv("DATABASE_URL")


# Connect to SQLite database
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()
