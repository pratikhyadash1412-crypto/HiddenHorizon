

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, Boolean
from sqlalchemy.sql import func
from database import Base



# =========================
# USERS
# =========================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="PUBLIC")

# =========================
# REVIEWS
# =========================



class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    rating = Column(Integer, nullable=False)
    feedback = Column(Text, nullable=False)
    
# =========================
# DESTINATIONS
# =========================

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100))

    description = Column(Text)

    latitude = Column(Float)
    longitude = Column(Float)

    destination_type = Column(String(30), nullable=False)

    # Government approval
    approved = Column(Boolean, default=False)

    current_footfall = Column(Integer, default=0)

    water_usage = Column(Float, default=0)
    waste_generation = Column(Float, default=0)
    pollution_level = Column(Float, default=0)




# =========================
# GUIDES
# =========================

class Guide(Base):
    __tablename__ = "guides"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    experience = Column(String(100))

    phone = Column(String(20))

    verification_status = Column(
        String(30),
        default="PENDING"
    )


# =========================
# GUIDE BOOKINGS
# =========================

class GuideBooking(Base):
    __tablename__ = "guide_bookings"

    id = Column(Integer, primary_key=True, index=True)

    guide_id = Column(
        Integer,
        ForeignKey("guides.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    destination_id = Column(
        Integer,
        ForeignKey("destinations.id")
    )

    booking_date = Column(String(30))

    status = Column(
        String(30),
        default="PENDING"
    )


# =========================
# STAYS
# =========================

class Stay(Base):
    __tablename__ = "stays"

    id = Column(Integer, primary_key=True, index=True)

    destination_id = Column(
        Integer,
        ForeignKey("destinations.id")
    )

    name = Column(String(150), nullable=False)

    address = Column(String(255))

    price_per_night = Column(Float)

    contact = Column(String(30))


# =========================
# FOOTFALL
# =========================

class Footfall(Base):
    __tablename__ = "footfall"

    id = Column(Integer, primary_key=True, index=True)

    destination_id = Column(
        Integer,
        ForeignKey("destinations.id")
    )

    month = Column(String(20))

    visitor_count = Column(Integer)


# =========================
# PLACE SUBMISSIONS
# =========================

class PlaceSubmission(Base):
    __tablename__ = "place_submissions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    name = Column(String(150), nullable=False)

    state = Column(String(100), nullable=False)

    district = Column(String(100))

    description = Column(Text)

    latitude = Column(Float)

    longitude = Column(Float)

    verification_status = Column(
        String(30),
        default="PENDING"
    )


# =========================
# AI ANALYSIS
# =========================

class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(Integer, primary_key=True, index=True)

    famous_destination_id = Column(
        Integer,
        ForeignKey("destinations.id")
    )

    hidden_destination_id = Column(
        Integer,
        ForeignKey("destinations.id")
    )

    visitor_shift_percentage = Column(Float)

    overcrowding_impact = Column(Float)

    employment_impact = Column(Float)

    local_purchase_impact = Column(Float)

    government_profit_impact = Column(Float)

    water_saving = Column(Float)

    waste_impact = Column(Float)

    pollution_impact = Column(Float)

    accessibility_score = Column(Float)

    ai_recommendation = Column(Text)