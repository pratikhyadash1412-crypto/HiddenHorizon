

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Form
from reviews import router as reviews_router
from ai import generate_ai_recommendation
from database import engine, Base, get_db
import models

# ---------------------------------------------------------
# LATEST REDISTRIBUTION SCENARIO
# ---------------------------------------------------------

latest_redistribution = {
    "famous_destination_id": None,
    "hidden_destination_id": None,
    "visitor_shift_percentage": 0,
}

app = FastAPI(title="S21 Tourism API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(reviews_router)

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
    email: str = Form(...),
    password: str = Form(...),
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


@app.get("/government/analytics")
def get_government_analytics(
    db: Session = Depends(get_db)
):
    # ---------------------------------------------
    # BASIC COUNTS
    # ---------------------------------------------

    total_destinations = (
        db.query(models.Destination).count()
    )

    total_guides = (
        db.query(models.Guide).count()
    )

    pending_places = (
        db.query(models.PlaceSubmission)
        .filter(
            models.PlaceSubmission.verification_status == "PENDING"
        )
        .count()
    )

    pending_guides = (
        db.query(models.Guide)
        .filter(
            models.Guide.verification_status == "PENDING"
        )
        .count()
    )

    # ---------------------------------------------
    # FOOTFALL
    # ---------------------------------------------

    footfall_records = (
        db.query(models.Footfall)
        .all()
    )

    total_visitors = sum(
        record.visitor_count or 0
        for record in footfall_records
    )

    if footfall_records:
        average_footfall = round(
            total_visitors / len(footfall_records)
        )
    else:
        average_footfall = 0

    # ---------------------------------------------
    # TOP DESTINATION
    # ---------------------------------------------

    destination_totals = {}

    for record in footfall_records:

        destination_id = record.destination_id

        destination_totals[destination_id] = (
            destination_totals.get(destination_id, 0)
            + (record.visitor_count or 0)
        )

    top_destination = None

    if destination_totals:

        top_destination_id = max(
            destination_totals,
            key=destination_totals.get
        )

        destination = (
            db.query(models.Destination)
            .filter(
                models.Destination.id ==
                top_destination_id
            )
            .first()
        )

        if destination:
            top_destination = destination.name

    # ---------------------------------------------
    # MONTHLY FOOTFALL
    # ---------------------------------------------

    monthly_footfall = {}

    for record in footfall_records:

        month = record.month or "Unknown"

        monthly_footfall[month] = (
            monthly_footfall.get(month, 0)
            + (record.visitor_count or 0)
        )

    # Convert dictionary into list
    monthly_footfall_data = [
        {
            "month": month,
            "visitors": visitors
        }
        for month, visitors
        in monthly_footfall.items()
    ]

    return {
        "total_destinations": total_destinations,
        "total_guides": total_guides,
        "pending_places": pending_places,
        "pending_guides": pending_guides,
        "total_visitors": total_visitors,
        "average_footfall": average_footfall,
        "top_destination": top_destination,
        "monthly_footfall": monthly_footfall_data
    }

@app.get("/government/ai-analysis")
def get_ai_analysis(
    db: Session = Depends(get_db)
):
    analyses = (
        db.query(models.AIAnalysis)
        .all()
    )

    results = []

    for analysis in analyses:

        famous_destination = (
            db.query(models.Destination)
            .filter(
                models.Destination.id ==
                analysis.famous_destination_id
            )
            .first()
        )

        hidden_destination = (
            db.query(models.Destination)
            .filter(
                models.Destination.id ==
                analysis.hidden_destination_id
            )
            .first()
        )

        results.append({
            "id": analysis.id,

            "famous_destination":
                famous_destination.name
                if famous_destination
                else "Unknown",

            "hidden_destination":
                hidden_destination.name
                if hidden_destination
                else "Unknown",

            "visitor_shift_percentage":
                analysis.visitor_shift_percentage or 0,

            "overcrowding_impact":
                analysis.overcrowding_impact or 0,

            "employment_impact":
                analysis.employment_impact or 0,

            "local_purchase_impact":
                analysis.local_purchase_impact or 0,

            "government_profit_impact":
                analysis.government_profit_impact or 0,

            "water_saving":
                analysis.water_saving or 0,

            "waste_impact":
                analysis.waste_impact or 0,

            "pollution_impact":
                analysis.pollution_impact or 0,

            "accessibility_score":
                analysis.accessibility_score or 0,

            "ai_recommendation":
                analysis.ai_recommendation
                or "No recommendation available."
        })

    return results

@app.post("/government/simulate-redistribution")
def simulate_redistribution(
    famous_destination_id: int,
    hidden_destination_id: int,
    visitor_shift_percentage: float,
    db: Session = Depends(get_db)
):
    # ---------------------------------------------
    # VALIDATE SHIFT
    # ---------------------------------------------

    if visitor_shift_percentage < 0 or visitor_shift_percentage > 100:
        raise HTTPException(
            status_code=400,
            detail="Visitor shift percentage must be between 0 and 100."
        )

    # ---------------------------------------------
    # GET DESTINATIONS
    # ---------------------------------------------

    famous = (
        db.query(models.Destination)
        .filter(
            models.Destination.id == famous_destination_id
        )
        .first()
    )

    hidden = (
        db.query(models.Destination)
        .filter(
            models.Destination.id == hidden_destination_id
        )
        .first()
    )

    if not famous:
        raise HTTPException(
            status_code=404,
            detail="Famous destination not found."
        )

    if not hidden:
        raise HTTPException(
            status_code=404,
            detail="Hidden destination not found."
        )

    # ---------------------------------------------
    # GET FOOTFALL RECORDS
    # ---------------------------------------------

    famous_footfall_records = (
        db.query(models.Footfall)
        .filter(
            models.Footfall.destination_id == famous_destination_id
        )
        .all()
    )

    hidden_footfall_records = (
        db.query(models.Footfall)
        .filter(
            models.Footfall.destination_id == hidden_destination_id
        )
        .all()
    )

    # ---------------------------------------------
    # CURRENT VISITORS
    # ---------------------------------------------

    if famous_footfall_records:
        famous_visitors = sum(
            record.visitor_count or 0
            for record in famous_footfall_records
        )
    else:
        famous_visitors = famous.current_footfall or 0

    if hidden_footfall_records:
        hidden_visitors = sum(
            record.visitor_count or 0
            for record in hidden_footfall_records
        )
    else:
        hidden_visitors = hidden.current_footfall or 0

    # ---------------------------------------------
    # VISITOR SHIFT
    # ---------------------------------------------

    shifted_visitors = round(
        famous_visitors *
        visitor_shift_percentage / 100
    )

    new_famous_visitors = max(
        famous_visitors - shifted_visitors,
        0
    )

    new_hidden_visitors = (
        hidden_visitors +
        shifted_visitors
    )

    # ---------------------------------------------
    # IMPACT CALCULATIONS
    # ---------------------------------------------

    overcrowding_impact = round(
        visitor_shift_percentage * 0.90,
        2
    )

    employment_impact = round(
        visitor_shift_percentage * 0.60,
        2
    )

    local_purchase_impact = round(
        visitor_shift_percentage * 0.75,
        2
    )

    government_profit_impact = round(
        visitor_shift_percentage * 0.50,
        2
    )

    water_saving = round(
        visitor_shift_percentage * 0.40,
        2
    )

    waste_impact = round(
        visitor_shift_percentage * 0.55,
        2
    )

    pollution_impact = round(
        visitor_shift_percentage * 0.45,
        2
    )

    # ---------------------------------------------
    # ACCESSIBILITY
    # ---------------------------------------------

    accessibility_score = getattr(
        hidden,
        "accessibility_score",
        None
    )

    if accessibility_score is None:
        accessibility_score = 70

    accessibility_score = round(
        float(accessibility_score),
        2
    )

    # ---------------------------------------------
    # AI RECOMMENDATION
    # ---------------------------------------------

    ai_recommendation = generate_ai_recommendation(
        famous.name,
        hidden.name,
        visitor_shift_percentage,
        overcrowding_impact,
        employment_impact,
        local_purchase_impact,
        government_profit_impact,
        water_saving,
        waste_impact,
        pollution_impact,
        accessibility_score
    )
        # ---------------------------------------------
    # SAVE AI ANALYSIS
    # ---------------------------------------------

    analysis = models.AIAnalysis(
        famous_destination_id=famous_destination_id,
        hidden_destination_id=hidden_destination_id,

        visitor_shift_percentage=visitor_shift_percentage,

        overcrowding_impact=overcrowding_impact,
        employment_impact=employment_impact,
        local_purchase_impact=local_purchase_impact,
        government_profit_impact=government_profit_impact,

        water_saving=water_saving,
        waste_impact=waste_impact,
        pollution_impact=pollution_impact,

        accessibility_score=accessibility_score,

        ai_recommendation=ai_recommendation
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    

    latest_redistribution["famous_destination_id"] = famous_destination_id
    latest_redistribution["hidden_destination_id"] = hidden_destination_id
    latest_redistribution["visitor_shift_percentage"] = visitor_shift_percentage




    # ---------------------------------------------
    # RETURN RESULT
    # ---------------------------------------------

    return {
        # Destination names
        "famous_destination": famous.name,
        "hidden_destination": hidden.name,

        # Original values
        "current_famous_visitors": famous_visitors,
        "current_hidden_visitors": hidden_visitors,

        # Frontend-friendly names
        "original_visitors": famous_visitors,
        "visitor_shift": shifted_visitors,
        "new_visitors": new_hidden_visitors,

        # Shift
        "visitor_shift_percentage": visitor_shift_percentage,
        "shifted_visitors": shifted_visitors,

        # New visitor totals
        "new_famous_visitors": new_famous_visitors,
        "new_hidden_visitors": new_hidden_visitors,

        # Impact metrics
        "overcrowding_impact": overcrowding_impact,
        "employment_impact": employment_impact,
        "local_purchase_impact": local_purchase_impact,
        "government_profit_impact": government_profit_impact,
        "water_saving": water_saving,
        "waste_impact": waste_impact,
        "pollution_impact": pollution_impact,

        # Accessibility
        "accessibility_score": accessibility_score,

        # AI Recommendation
        "ai_recommendation": ai_recommendation
    }
@app.get("/government/destination-scores")
def get_destination_scores(
    db: Session = Depends(get_db)
):
    destinations = (
        db.query(models.Destination)
        .filter(models.Destination.approved == True)
        .all()
    )

    if not destinations:
        return []

    # ---------------------------------------------------------
    # LATEST SIMULATION
    # ---------------------------------------------------------

    source_id = latest_redistribution.get(
        "famous_destination_id"
    )

    hidden_id = latest_redistribution.get(
        "hidden_destination_id"
    )

    shift_percentage = latest_redistribution.get(
        "visitor_shift_percentage",
        0
    )

    shift_fraction = shift_percentage / 100

    # ---------------------------------------------------------
    # CALCULATE SIMULATED FOOTFALL
    # ---------------------------------------------------------

    simulated_footfall = {}

    for destination in destinations:

        footfall = destination.current_footfall or 0

        # Source loses tourists
        if destination.id == source_id:

            shifted_visitors = footfall * shift_fraction

            simulated_footfall[destination.id] = max(
                0,
                footfall - shifted_visitors
            )

        # Hidden destination receives tourists
        elif destination.id == hidden_id and source_id:

            source_destination = next(
                (
                    d for d in destinations
                    if d.id == source_id
                ),
                None
            )

            if source_destination:

                source_footfall = (
                    source_destination.current_footfall or 0
                )

                shifted_visitors = (
                    source_footfall * shift_fraction
                )

                simulated_footfall[destination.id] = (
                    footfall + shifted_visitors
                )

            else:
                simulated_footfall[destination.id] = footfall

        else:
            simulated_footfall[destination.id] = footfall

    # ---------------------------------------------------------
    # NORMALIZATION
    # ---------------------------------------------------------

    max_footfall = max(
        simulated_footfall.values(),
        default=1
    )

    max_water = max(
        [d.water_usage or 0 for d in destinations],
        default=1
    )

    max_waste = max(
        [d.waste_generation or 0 for d in destinations],
        default=1
    )

    max_pollution = max(
        [d.pollution_level or 0 for d in destinations],
        default=1
    )

    results = []

    # ---------------------------------------------------------
    # BUILD RESULTS
    # ---------------------------------------------------------

    for destination in destinations:

        footfall = simulated_footfall.get(
            destination.id,
            destination.current_footfall or 0
        )

        footfall_score = (
            footfall / max_footfall
        ) * 100

        water_score = (
            (destination.water_usage or 0)
            / max_water
        ) * 100

        waste_score = (
            (destination.waste_generation or 0)
            / max_waste
        ) * 100

        pollution_score = (
            (destination.pollution_level or 0)
            / max_pollution
        ) * 100

        vulnerability_score = round(
            (
                footfall_score * 0.40
                + water_score * 0.20
                + waste_score * 0.20
                + pollution_score * 0.20
            ),
            2
        )

        if vulnerability_score >= 75:
            category = "HIGH PRESSURE"

        elif vulnerability_score >= 50:
            category = "MODERATE PRESSURE"

        else:
            category = "LOW PRESSURE"

        results.append({
            "id": destination.id,
            "name": destination.name,
            "state": destination.state,
            "district": destination.district,

            # IMPORTANT:
            # Return simulated value, not database value
            "current_footfall": round(footfall),

            "water_usage":
                destination.water_usage or 0,

            "waste_generation":
                destination.waste_generation or 0,

            "pollution_level":
                destination.pollution_level or 0,

            "footfall_score":
                round(footfall_score, 2),

            "water_score":
                round(water_score, 2),

            "waste_score":
                round(waste_score, 2),

            "pollution_score":
                round(pollution_score, 2),

            "vulnerability_score":
                vulnerability_score,

            "category":
                category
        })

    results.sort(
        key=lambda x: x["vulnerability_score"],
        reverse=True
    )

    return results
@app.get("/government/recommended-destination")
def recommended_destination(
    db: Session = Depends(get_db)
):
    destinations = (
        db.query(models.Destination)
        .filter(
            models.Destination.approved == True
        )
        .all()
    )

    if not destinations:
        raise HTTPException(
            status_code=404,
            detail="No approved destinations available."
        )

    # ---------------------------------------------------------
    # LATEST SIMULATION
    # ---------------------------------------------------------

    source_id = latest_redistribution.get(
        "famous_destination_id"
    )

    hidden_id = latest_redistribution.get(
        "hidden_destination_id"
    )

    shift_percentage = latest_redistribution.get(
        "visitor_shift_percentage",
        0
    )

    # ---------------------------------------------------------
    # IF SIMULATION EXISTS, USE ITS DESTINATIONS
    # ---------------------------------------------------------

    if source_id and hidden_id:

        famous = next(
            (
                d for d in destinations
                if d.id == source_id
            ),
            None
        )

        simulated_hidden = next(
            (
                d for d in destinations
                if d.id == hidden_id
            ),
            None
        )

        if famous and simulated_hidden:

            famous_footfall = (
                famous.current_footfall or 0
            )

            hidden_footfall = (
                simulated_hidden.current_footfall or 0
            )

            shifted_visitors = (
                famous_footfall
                * (shift_percentage / 100)
            )

            new_famous_footfall = max(
                0,
                famous_footfall - shifted_visitors
            )

            new_hidden_footfall = (
                hidden_footfall + shifted_visitors
            )

            # -------------------------------------------------
            # RECOMMENDATION SCORE
            # -------------------------------------------------

            footfall_ratio = (
                new_hidden_footfall
                / max(famous_footfall, 1)
            )

            water_ratio = (
                (simulated_hidden.water_usage or 0)
                / max(famous.water_usage or 1, 1)
            )

            waste_ratio = (
                (simulated_hidden.waste_generation or 0)
                / max(famous.waste_generation or 1, 1)
            )

            pollution_ratio = (
                (simulated_hidden.pollution_level or 0)
                / max(famous.pollution_level or 1, 1)
            )

            pressure_score = (
                footfall_ratio * 40
                + water_ratio * 20
                + waste_ratio * 20
                + pollution_ratio * 20
            )

            score = round(
                max(0, 100 - pressure_score),
                2
            )

            return {
                "source_destination":
                    famous.name,

                "recommended_destination":
                    simulated_hidden.name,

                "source_destination_id":
                    famous.id,

                "recommended_destination_id":
                    simulated_hidden.id,

                "source_footfall":
                    round(new_famous_footfall),

                "recommended_footfall":
                    round(new_hidden_footfall),

                "recommendation_score":
                    score,

                "reason": (
                    f"{simulated_hidden.name} has lower tourism "
                    f"pressure than {famous.name} and has greater "
                    f"capacity to receive redistributed tourists."
                )
            }

    # ---------------------------------------------------------
    # FALLBACK — NO SIMULATION YET
    # ---------------------------------------------------------

    famous = max(
        destinations,
        key=lambda destination:
        destination.current_footfall or 0
    )

    famous_footfall = (
        famous.current_footfall or 0
    )

    if famous_footfall <= 0:
        raise HTTPException(
            status_code=400,
            detail="No destination has current visitor data."
        )

    candidates = [
        destination
        for destination in destinations
        if destination.id != famous.id
        and (
            destination.current_footfall or 0
        ) < famous_footfall * 0.30
    ]

    if not candidates:
        raise HTTPException(
            status_code=404,
            detail="No suitable hidden destination found."
        )

    def recommendation_score(destination):

        footfall = destination.current_footfall or 0
        water = destination.water_usage or 0
        waste = destination.waste_generation or 0
        pollution = destination.pollution_level or 0

        pressure_score = (
            (footfall / famous_footfall) * 40
            + (
                water /
                max(famous.water_usage or 1, 1)
            ) * 20
            + (
                waste /
                max(famous.waste_generation or 1, 1)
            ) * 20
            + (
                pollution /
                max(famous.pollution_level or 1, 1)
            ) * 20
        )

        return max(
            0,
            100 - pressure_score
        )

    recommended = max(
        candidates,
        key=recommendation_score
    )

    score = round(
        recommendation_score(recommended),
        2
    )

    return {
        "source_destination":
            famous.name,

        "recommended_destination":
            recommended.name,

        "source_destination_id":
            famous.id,

        "recommended_destination_id":
            recommended.id,

        "source_footfall":
            famous_footfall,

        "recommended_footfall":
            recommended.current_footfall or 0,

        "recommendation_score":
            score,

        "reason": (
            f"{recommended.name} has lower tourism pressure "
            f"than {famous.name} and has greater capacity "
            f"to receive redistributed tourists."
        )
    }
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

