"""Recommendation schemas placeholder."""
# backend/app/schemas/recommendation.py

from pydantic import BaseModel, Field
from typing import List, Literal, Optional


class RecommendationRequest(BaseModel):
    """
    This schema defines what the frontend quiz will send to the backend.
    These are the shopper answers used to filter products first.
    """

    # Shopper's budget level
    budget_band: Literal["budget", "mid", "premium"]

    # Shopper's main running goal
    main_goal: Literal["daily_jogging", "speed_training", "trail_running", "race_day"]

    # Shopper's running experience
    experience_level: Literal["beginner", "intermediate", "advanced"]

    # Shopper's top priority when choosing shoes
    priority: Literal["comfort", "speed", "support", "value"]

    # Where the shopper usually runs
    terrain: Literal["road", "trail"]

    # Whether the shopper needs added support
    needs_extra_support: bool

    # Shopper's preferred fit
    fit_preference: Literal["regular", "wide", "narrow"]


class RecommendationItem(BaseModel):
    """
    This schema defines one recommended product in the API response.
    """

    # ID must match a real product from the product catalog
    product_id: str = Field(..., description="Recommended product ID")

    # Human-readable product name
    product_name: str = Field(..., description="Recommended product name")

    # Match score from 0 to 100
    match_score: int = Field(..., ge=0, le=100, description="Recommendation confidence score")

    # Short explanation of why this product was recommended
    reason: str = Field(..., min_length=1, description="Reason for recommendation")


class RecommendationResponse(BaseModel):
    """
    This schema defines the final API response returned to the frontend.
    """

    # Request ID will help later for logging and tracing
    request_id: Optional[str] = Field(default=None, description="Unique request ID")

    # Short overall summary of the recommendations
    summary: str = Field(..., min_length=1, description="Recommendation summary")

    # Top recommended products
    recommendations: List[RecommendationItem] = Field(default_factory=list)