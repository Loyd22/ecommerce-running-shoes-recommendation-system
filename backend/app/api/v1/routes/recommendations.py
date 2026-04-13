"""Recommendation API route placeholder."""
# backend/app/api/v1/routes/recommendations.py

from fastapi import APIRouter, HTTPException, status

from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.recommendation_service import RecommendationService

# Create a router object so this file only manages recommendation-related endpoints
router = APIRouter(prefix="/recommendations", tags=["recommendations"])

# Create the service once so the route can use it
recommendation_service = RecommendationService()


@router.post(
    "",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
)
def create_recommendation(
    shopper_input: RecommendationRequest,
) -> RecommendationResponse:
    """
    Receive shopper quiz answers and return validated product recommendations.

    This route stays thin:
    - FastAPI validates the request using RecommendationRequest
    - the service handles the business logic
    - the route only converts errors into API responses
    """
    try:
        # Call the main recommendation workflow
        result = recommendation_service.recommend(shopper_input)
        return result

    except ValueError as exc:
        # Handle expected business or validation errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except Exception as exc:
     raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=str(exc),
    ) from exc