from pydantic import BaseModel, Field
from datetime import datetime


class ReviewCreate(BaseModel):
    destination_id: int
    user_id: int
    rating: int = Field(..., ge=1, le=5)
    feedback: str


class ReviewResponse(BaseModel):
    id: int
    destination_id: int
    user_id: int
    rating: int
    feedback: str
    

    class Config:
        from_attributes = True