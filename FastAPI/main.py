from fastapi import FastAPI, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db_setup import SessionLocal, engine
import models

# this CORS Middleware is used for allowing applications to call this application:
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# this is the ulr of the application that can call this application:
origins = [
    "http://localhost:3000",
]

# Adding URL to Middleware:
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Types Validation:
class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str


class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True


# DataBase Configurations:
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_deb = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


# creating "Transaction" endpoint:
@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_deb):
    print(transaction)
    trans = models.Transaction(**transaction.dict())
    db.add(trans)
    db.commit()
    db.refresh(trans)
    return trans


# getting "Transactions" endpoint:
@app.get("/transactions/", response_model=List[TransactionModel])
async def get_transactions(db: db_deb, skip: int = 0, limit: int = 100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions


# deleting a "Transaction" endpoint:
@app.delete("/transactions/{id}")
async def delete_transaction(id: int, db: db_deb):
    trans = (
        db.query(models.Transaction).filter(models.Transaction.id == id).first()
    )
    db.delete(trans)
    db.commit()
    return "Success"
