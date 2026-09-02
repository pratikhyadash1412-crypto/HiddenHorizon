from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime


# =========================
# COMMON ORM CONFIG
# =========================
class BaseConfig(BaseModel):
    class Config:
        from_attributes = True  # Pydantic v2
        # orm_mode = True # Use this instead if using Pydantic v1


# =========================
# REVIEWS
# =========================
class ReviewCreate(BaseModel):
    destination_id: int
    user_id: int
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    feedback: str


class ReviewResponse(BaseConfig):
    id: int
    destination_id: int
    user_id: int
    rating: int
    feedback: str


# =========================
# PLACE SUBMISSIONS
# =========================
class PlaceSubmissionBase(BaseModel):
    name: str
    state: str
    district: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = Field(None, description="Custom background image URL")


class PlaceSubmissionCreate(PlaceSubmissionBase):
    user_id: int


class PlaceSubmissionResponse(BaseConfig, PlaceSubmissionBase):
    id: int
    user_id: int
    verification_status: str  # e.g., PENDING, APPROVED, REJECTED


# =========================
# DESTINATIONS
# =========================
class DestinationBase(BaseModel):
    name: str
    state: str
    district: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    destination_type: str  # e.g., hidden, popular
    image_url: Optional[str] = Field(None, description="Custom background image URL")
    approved: bool = False
    guidelines: Optional[str] = None


class DestinationResponse(BaseConfig, DestinationBase):
    id: int
    current_footfall: int = 0
    water_usage: float = 0.0
    waste_generation: float = 0.0
    pollution_level: float = 0.0
