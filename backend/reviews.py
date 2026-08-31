from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Review
from schemas import ReviewCreate, ReviewResponse

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


@router.get(
    "/destination/{destination_id}",
    response_model=list[ReviewResponse]
)
def get_reviews(
    destination_id: int,
    db: Session = Depends(get_db)
):
    reviews = (
        db.query(Review)
        .filter(Review.destination_id == destination_id)
        .all()
    )

    return reviews


@router.post(
    "/",
    response_model=ReviewResponse,
    status_code=201
)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    new_review = Review(
        destination_id=review.destination_id,
        user_id=review.user_id,
        rating=review.rating,
        feedback=review.feedback
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review