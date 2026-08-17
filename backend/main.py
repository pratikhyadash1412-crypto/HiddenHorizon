

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models

app = FastAPI(title="S21 Tourism API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "S21 Tourism Backend is Running"
    }


# =========================
# LOGIN
# =========================

@app.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(
            models.User.email == email,
            models.User.password == password
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }


# =========================
# GET STATES
# =========================

@app.get("/states")
def get_states(db: Session = Depends(get_db)):

    states = (
        db.query(models.Destination.state)
        .filter(models.Destination.approved == True)
        .distinct()
        .all()
    )

    return [state[0] for state in states]


# =========================
# GET HIDDEN DESTINATIONS
# =========================

@app.get("/destinations/{state}")
def get_destinations(
    state: str,
    db: Session = Depends(get_db)
):

    destinations = (
        db.query(models.Destination)
        .filter(
            models.Destination.state == state,
            models.Destination.destination_type == "hidden",
            models.Destination.approved == True
        )
        .all()
    )

    return destinations


# =========================
# GET DESTINATION DETAILS
# =========================

@app.get("/destination/{destination_id}")
def get_destination(
    destination_id: int,
    db: Session = Depends(get_db)
):

    destination = (
        db.query(models.Destination)
        .filter(models.Destination.id == destination_id)
        .first()
    )

    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found"
        )

    return destination


# =========================
# GET REVIEWS
# =========================

@app.get("/reviews/{destination_id}")
def get_reviews(
    destination_id: int,
    db: Session = Depends(get_db)
):

    reviews = (
        db.query(models.Review)
        .filter(models.Review.destination_id == destination_id)
        .all()
    )

    return reviews


# =========================
# GET FOOTFALL
# =========================

@app.get("/footfall/{destination_id}")
def get_footfall(
    destination_id: int,
    db: Session = Depends(get_db)
):

    data = (
        db.query(models.Footfall)
        .filter(models.Footfall.destination_id == destination_id)
        .all()
    )

    return data


# =========================
# GET NEARBY STAYS
# =========================

@app.get("/stays/{destination_id}")
def get_stays(
    destination_id: int,
    db: Session = Depends(get_db)
):

    stays = (
        db.query(models.Stay)
        .filter(models.Stay.destination_id == destination_id)
        .all()
    )

    return stays


# =========================
# GET VERIFIED GUIDES
# =========================

@app.get("/guides")
def get_guides(
    db: Session = Depends(get_db)
):

    guides = (
        db.query(models.Guide)
        .filter(
            models.Guide.verification_status == "APPROVED"
        )
        .all()
    )

    return guides
# =========================
# SUBMIT NEW PLACE
# =========================

@app.post("/places/submit")
def submit_place(
    user_id: int,
    name: str,
    state: str,
    district: str,
    description: str,
    latitude: float,
    longitude: float,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    submission = models.PlaceSubmission(
        user_id=user_id,
        name=name,
        state=state,
        district=district,
        description=description,
        latitude=latitude,
        longitude=longitude
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "message": "Place submitted successfully",
        "submission_id": submission.id,
        "status": submission.verification_status
    }


# =========================
# ADD REVIEW
# =========================

@app.post("/reviews")
def add_review(
    user_id: int,
    destination_id: int,
    rating: int,
    feedback: str,
    db: Session = Depends(get_db)
):

    if rating < 1 or rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    review = models.Review(
        user_id=user_id,
        destination_id=destination_id,
        rating=rating,
        feedback=feedback
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "message": "Review added successfully",
        "review_id": review.id
    }


# =========================
# REGISTER AS GUIDE
# =========================

@app.post("/guides/register")
def register_guide(
    user_id: int,
    experience: str,
    phone: str,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_guide = (
        db.query(models.Guide)
        .filter(models.Guide.user_id == user_id)
        .first()
    )

    if existing_guide:
        raise HTTPException(
            status_code=400,
            detail="Guide application already exists"
        )

    guide = models.Guide(
        user_id=user_id,
        experience=experience,
        phone=phone,
        verification_status="PENDING"
    )

    db.add(guide)
    db.commit()
    db.refresh(guide)

    return {
        "message": "Guide application submitted",
        "guide_id": guide.id,
        "verification_status": "PENDING"
    }


# =========================
# BOOK GUIDE
# =========================

@app.post("/guide/book")
def book_guide(
    user_id: int,
    guide_id: int,
    destination_id: int,
    booking_date: str,
    db: Session = Depends(get_db)
):

    guide = (
        db.query(models.Guide)
        .filter(
            models.Guide.id == guide_id,
            models.Guide.verification_status == "APPROVED"
        )
        .first()
    )

    if not guide:
        raise HTTPException(
            status_code=404,
            detail="Verified guide not found"
        )

    booking = models.GuideBooking(
        guide_id=guide_id,
        user_id=user_id,
        destination_id=destination_id,
        booking_date=booking_date,
        status="PENDING"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "message": "Guide booking request created",
        "booking_id": booking.id,
        "status": "PENDING"
    }
# =========================
# GOVERNMENT:
# VIEW PENDING PLACE SUBMISSIONS
# =========================

@app.get("/government/place-submissions")
def get_place_submissions(
    db: Session = Depends(get_db)
):

    submissions = (
        db.query(models.PlaceSubmission)
        .filter(
            models.PlaceSubmission.verification_status == "PENDING"
        )
        .all()
    )

    return submissions


# =========================
# GOVERNMENT:
# APPROVE PLACE
# =========================

@app.put("/government/place/{submission_id}/approve")
def approve_place(
    submission_id: int,
    db: Session = Depends(get_db)
):

    submission = (
        db.query(models.PlaceSubmission)
        .filter(
            models.PlaceSubmission.id == submission_id
        )
        .first()
    )

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Place submission not found"
        )

    submission.verification_status = "APPROVED"

    # Create an actual destination
    destination = models.Destination(
        name=submission.name,
        state=submission.state,
        district=submission.district,
        description=submission.description,
        latitude=submission.latitude,
        longitude=submission.longitude,
        destination_type="hidden",
        approved=True
    )

    db.add(destination)
    db.commit()

    return {
        "message": "Place approved successfully",
        "place": submission.name
    }


# =========================
# GOVERNMENT:
# REJECT PLACE
# =========================

@app.put("/government/place/{submission_id}/reject")
def reject_place(
    submission_id: int,
    db: Session = Depends(get_db)
):

    submission = (
        db.query(models.PlaceSubmission)
        .filter(
            models.PlaceSubmission.id == submission_id
        )
        .first()
    )

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Place submission not found"
        )

    submission.verification_status = "REJECTED"

    db.commit()

    return {
        "message": "Place rejected",
        "place": submission.name
    }


# =========================
# GOVERNMENT:
# VIEW PENDING GUIDES
# =========================

@app.get("/government/guides")
def get_pending_guides(
    db: Session = Depends(get_db)
):

    guides = (
        db.query(models.Guide)
        .filter(
            models.Guide.verification_status == "PENDING"
        )
        .all()
    )

    return guides


# =========================
# GOVERNMENT:
# APPROVE GUIDE
# =========================

@app.put("/government/guide/{guide_id}/approve")
def approve_guide(
    guide_id: int,
    db: Session = Depends(get_db)
):

    guide = (
        db.query(models.Guide)
        .filter(models.Guide.id == guide_id)
        .first()
    )

    if not guide:
        raise HTTPException(
            status_code=404,
            detail="Guide application not found"
        )

    guide.verification_status = "APPROVED"

    db.commit()

    return {
        "message": "Guide approved successfully",
        "guide_id": guide.id
    }


# =========================
# GOVERNMENT:
# REJECT GUIDE
# =========================

@app.put("/government/guide/{guide_id}/reject")
def reject_guide(
    guide_id: int,
    db: Session = Depends(get_db)
):

    guide = (
        db.query(models.Guide)
        .filter(models.Guide.id == guide_id)
        .first()
    )

    if not guide:
        raise HTTPException(
            status_code=404,
            detail="Guide application not found"
        )

    guide.verification_status = "REJECTED"

    db.commit()

    return {
        "message": "Guide rejected",
        "guide_id": guide.id
    }