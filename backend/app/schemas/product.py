# backend/app/schemas/product.py

from pydantic import BaseModel, Field
from typing import List, Literal


class Product(BaseModel):
    """
    This schema defines the shape of one product in our catalog.
    We will use this when loading products from products_clean.json.
    """

    # Unique ID for the product
    id: str = Field(..., description="Unique product ID")

    # Product display name
    name: str = Field(..., description="Product name")

    # Brand name such as Nike, Adidas, ASICS
    brand: str = Field(..., description="Brand name")

    # Product category
    category: str = Field(..., description="Product category")

    # Product price in pesos
    price: float = Field(..., ge=0, description="Product price")

    # Budget grouping used for filtering
    budget_band: Literal["budget", "mid", "premium"]

    # Intended runner experience level
    experience_level: Literal["beginner", "intermediate", "advanced"]

    # Main use case of the shoe
    use_case: Literal["daily_jogging", "speed_training", "trail_running", "race_day"]

    # Terrain where the shoe is best used
    terrain: Literal["road", "trail"]

    # Support type of the shoe
    support_level: Literal["neutral", "stability"]

    # Fit type of the shoe
    fit_type: Literal["regular", "wide", "narrow"]

    # Important product features
    key_features: List[str] = Field(default_factory=list)

    # Short explanation of the product
    short_description: str = Field(..., description="Short product description")

    # Stock status
    availability: Literal["in_stock", "out_of_stock"]