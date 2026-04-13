"""Catalog service for loading and filtering running shoe products."""
# backend/app/services/catalog_service.py

import json
from pathlib import Path
from typing import List

from app.schemas.product import Product
from app.schemas.recommendation import RecommendationRequest


class CatalogService:
    """
    This service is responsible for:
    1. Loading products from the clean JSON catalog
    2. Filtering products based on shopper quiz answers

    We keep this logic separate so the backend remains modular and easy to maintain.
    """

    def __init__(self) -> None:
        """
        Build the catalog path safely based on this file's location.

        Why this is better:
        - Relative paths like 'data/processed/products_clean.json' can break
          depending on where the server is started from.
        - This approach always finds the project root first, then builds the path.
        """
        # This file is located at:
        # backend/app/services/catalog_service.py
        #
        # parents[0] = services
        # parents[1] = app
        # parents[2] = backend
        # parents[3] = project root folder
        project_root = Path(__file__).resolve().parents[3]

        # Build the full absolute path to the JSON catalog
        self.catalog_path = project_root / "data" / "processed" / "products_clean.json"

    def load_products(self) -> List[Product]:
        """
        Load all products from the JSON file and convert them into Product schema objects.

        Returns:
            A list of Product objects
        """
        # Give a clear error if the file path is wrong or the file is missing
        if not self.catalog_path.exists():
            raise FileNotFoundError(
                f"Product catalog not found at: {self.catalog_path}"
            )

        with self.catalog_path.open("r", encoding="utf-8") as file:
            raw_products = json.load(file)

        products = [Product(**item) for item in raw_products]
        return products

    def filter_candidates(self, shopper_input: RecommendationRequest) -> List[Product]:
        """
        Filter products based on shopper quiz answers.

        This method applies filtering in stages:
        1. Strong filters first
        2. Softer filters after

        This helps us avoid becoming too strict too early.

        Args:
            shopper_input: The validated shopper quiz answers

        Returns:
            A list of candidate Product objects
        """
        products = self.load_products()

        # -------------------------------------------
        # Step 1: Only keep products that are in stock
        # -------------------------------------------
        candidates = [
            product for product in products
            if product.availability == "in_stock"
        ]

        # -------------------------------------------
        # Step 2: Apply strong filters
        # These are the main business filters
        # -------------------------------------------

        # Filter by budget band
        budget_filtered = [
            product for product in candidates
            if product.budget_band == shopper_input.budget_band
        ]
        if budget_filtered:
            candidates = budget_filtered

        # Filter by main goal -> mapped to product use_case
        goal_filtered = [
            product for product in candidates
            if product.use_case == shopper_input.main_goal
        ]
        if goal_filtered:
            candidates = goal_filtered

        # Filter by terrain
        terrain_filtered = [
            product for product in candidates
            if product.terrain == shopper_input.terrain
        ]
        if terrain_filtered:
            candidates = terrain_filtered

        # -------------------------------------------
        # Step 3: Apply softer filters
        # These are preference-style filters
        # -------------------------------------------

        # Filter by experience level
        experience_filtered = [
            product for product in candidates
            if product.experience_level == shopper_input.experience_level
        ]
        if experience_filtered:
            candidates = experience_filtered

        # If the shopper needs extra support,
        # try to keep only stability shoes
        if shopper_input.needs_extra_support:
            support_filtered = [
                product for product in candidates
                if product.support_level == "stability"
            ]
            if support_filtered:
                candidates = support_filtered

        # Filter by fit preference
        fit_filtered = [
            product for product in candidates
            if product.fit_type == shopper_input.fit_preference
        ]
        if fit_filtered:
            candidates = fit_filtered

        return candidates