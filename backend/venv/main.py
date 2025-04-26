from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from uuid import uuid4
from typing import List
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


import models
from database import SessionLocal, engine
from pydantic import BaseModel

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency: get database session
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas
class CarOwnerCreate(BaseModel):
    name: str
    number_plate: str
    car_type: str
    phone_number: str

class CarOwnerOut(BaseModel):
    id: str
    check_in_time: datetime
    name: str
    number_plate: str
    car_type: str
    phone_number: str

    class Config:
        orm_mode = True

@app.post("/car-owners/", response_model=CarOwnerOut)
def create_car_owner(car_owner: CarOwnerCreate, db: Session = Depends(get_db)):
    db_car_owner = models.CarOwner(
        id=str(uuid4()),
        name=car_owner.name,
        number_plate=car_owner.number_plate,
        car_type=car_owner.car_type,
        phone_number=car_owner.phone_number,
    )
    db.add(db_car_owner)
    db.commit()
    db.refresh(db_car_owner)
    return db_car_owner

@app.get("/car-owners/", response_model=List[CarOwnerOut])
def get_car_owners(db: Session = Depends(get_db)):
    return db.query(models.CarOwner).all()

@app.get("/car-owners/{car_owner_id}", response_model=CarOwnerOut)
def get_car_owner(car_owner_id: str, db: Session = Depends(get_db)):
    car_owner = db.query(models.CarOwner).filter(models.CarOwner.id == car_owner_id).first()
    if not car_owner:
        raise HTTPException(status_code=404, detail="Car owner not found")
    return car_owner

@app.put("/car-owners/{car_owner_id}", response_model=CarOwnerOut)
def update_car_owner(car_owner_id: str, car_owner_update: CarOwnerCreate, db: Session = Depends(get_db)):
    car_owner = db.query(models.CarOwner).filter(models.CarOwner.id == car_owner_id).first()
    if not car_owner:
        raise HTTPException(status_code=404, detail="Car owner not found")
    
    car_owner.name = car_owner_update.name
    car_owner.number_plate = car_owner_update.number_plate
    car_owner.car_type = car_owner_update.car_type
    car_owner.phone_number = car_owner_update.phone_number

    db.commit()
    db.refresh(car_owner)
    return car_owner

@app.delete("/car-owners/{car_owner_id}")
def delete_car_owner(car_owner_id: str, db: Session = Depends(get_db)):
    car_owner = db.query(models.CarOwner).filter(models.CarOwner.id == car_owner_id).first()
    if not car_owner:
        raise HTTPException(status_code=404, detail="Car owner not found")
    db.delete(car_owner)
    db.commit()
    return {"message": "Car owner deleted successfully"}
