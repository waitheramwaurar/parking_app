from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime, timezone, timedelta
from fastapi.middleware.cors import CORSMiddleware
from schemas import CarOwnerResponse
from pydantic import BaseModel
from typing import List
from models import CarOwner
from database import SessionLocal, engine

# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class CarOwnerCreate(BaseModel):
    name: str
    number_plate: str
    car_type: str
    phone_number: str

class CarOwnerOut(BaseModel):
    id: str
    check_in_time: datetime
    check_out_time: datetime | None  # Optional check-out time
    name: str
    number_plate: str
    car_type: str
    phone_number: str
    checked_out: bool  # This will show the checkout status

    class Config:
        orm_mode = True

# CRUD endpoints
@app.post("/car-owners/", response_model=CarOwnerOut)
def create_car_owner(car_owner: CarOwnerCreate, db: Session = Depends(get_db)):
    db_car_owner = CarOwner(
        id=str(uuid4()),
        name=car_owner.name,
        number_plate=car_owner.number_plate,
        car_type=car_owner.car_type,
        phone_number=car_owner.phone_number,
        check_in_time=datetime.now(timezone(timedelta(hours=3))),  # EAT
        checked_out=False  # Ensuring the new car owner starts with checked_out = False
    )
    db.add(db_car_owner)
    db.commit()
    db.refresh(db_car_owner)
    return db_car_owner

@app.get("/car-owners/", response_model=List[CarOwnerResponse])
async def get_car_owners_route(db: Session = Depends(get_db)):
    car_owners = db.query(CarOwner).all()
    
    # Ensure checked_out is always a boolean (default False if None)
    for car_owner in car_owners:
        if car_owner.checked_out is None:
            car_owner.checked_out = False  # Set default value if None

    return car_owners

@app.get("/car-owners/{car_owner_id}", response_model=CarOwnerOut)
def get_car_owner(car_owner_id: str, db: Session = Depends(get_db)):
    car_owner = db.query(CarOwner).filter(CarOwner.id == car_owner_id).first()
    if not car_owner:
        raise HTTPException(status_code=404, detail="Car owner not found")
    return car_owner

@app.put("/car-owners/{car_owner_id}", response_model=CarOwnerOut)
def update_car_owner(car_owner_id: str, car_owner_update: CarOwnerCreate, db: Session = Depends(get_db)):
    car_owner = db.query(CarOwner).filter(CarOwner.id == car_owner_id).first()
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
    car_owner = db.query(CarOwner).filter(CarOwner.id == car_owner_id).first()
    if not car_owner:
        raise HTTPException(status_code=404, detail="Car owner not found")
    db.delete(car_owner)
    db.commit()
    return {"message": "Car owner deleted successfully"}

@app.patch("/car-owners/{car_owner_id}/checkout")
def checkout_car_owner(car_owner_id: str, db: Session = Depends(get_db)):
    car_owner = db.query(CarOwner).filter(CarOwner.id == car_owner_id).first()
    if not car_owner:
        raise HTTPException(status_code=404, detail="Car owner not found")
    if car_owner.checked_out:
        raise HTTPException(status_code=400, detail="Already checked out")
    
    # Update the checked_out status and check_out_time
    car_owner.checked_out = True
    car_owner.check_out_time = datetime.now(timezone(timedelta(hours=3)))  # EAT
    
    db.commit()
    db.refresh(car_owner)
    
    return {"message": "Car checked out"}
