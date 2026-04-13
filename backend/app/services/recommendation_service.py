"""Recommendation service placeholder."""
# backend/app/services/recommendation_service.py

import json
from typing import Dict, List, Set

from app.prompts.recommendation_prompt import build_recommendation_prompt
from app.schemas.product import Product
from app.schemas.recommendation import (
    RecommendationItem,
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.ai_client import AIClient
from app.services.catalog_service import CatalogService


class RecommendationService:
    """
    This service connects the whole recommendation workflow.

    Responsibilities:
    1. Filter valid candidate products
    2. Build the AI prompt
    3. Call the AI model
    4. Parse the raw output
    5. Validate the result
    6. Return a clean structured response
    """

    def __init__(self) -> None:
        """
        Create the service dependencies.

        We keep dependencies separate so this service only orchestrates the flow.
        """
        self.catalog_service = CatalogService()
        self.ai_client = AIClient()

    def recommend(self, shopper_input: RecommendationRequest) -> RecommendationResponse:
        """
        Run the full recommendation flow.

        Args:
            shopper_input: The validated shopper quiz answers from the frontend

        Returns:
            A validated recommendation response

        Raises:
            ValueError: If candidate products do not exist or AI output is invalid
        """
        # Step 1: Filter valid candidate products first.
        # This is an important business rule.
        candidate_products = self.catalog_service.filter_candidates(shopper_input)

        if not candidate_products:
            raise ValueError("No matching products found for the given shopper input.")

        # Step 2: Build a strict prompt using only those candidates.
        prompt = build_recommendation_prompt(
            shopper_input=shopper_input,
            candidate_products=candidate_products,
        )

        # Step 3: Get raw output from the AI model.
        raw_output = self.ai_client.get_recommendation(prompt)

        # Step 4: Parse and validate the AI output.
        validated_response = self._parse_and_validate_response(
            raw_output=raw_output,
            candidate_products=candidate_products,
        )

        return validated_response

    def _parse_and_validate_response(
        self,
        raw_output: str,
        candidate_products: List[Product],
    ) -> RecommendationResponse:
        """
        Parse raw AI output and validate that it follows our rules.

        Args:
            raw_output: The raw string returned by the AI model
            candidate_products: The filtered products that AI was allowed to use

        Returns:
            A validated RecommendationResponse object

        Raises:
            ValueError: If the AI output is invalid
        """
        # Step 1: Convert raw text into a Python dictionary.
        try:
            parsed_data = json.loads(raw_output)
        except json.JSONDecodeError as exc:
            raise ValueError("AI returned invalid JSON.") from exc

        # Step 2: Check required top-level fields.
        if "summary" not in parsed_data or not str(parsed_data["summary"]).strip():
            raise ValueError("AI response is missing a valid summary.")

        if "recommendations" not in parsed_data:
            raise ValueError("AI response is missing recommendations.")

        if not isinstance(parsed_data["recommendations"], list):
            raise ValueError("Recommendations must be a list.")

        if len(parsed_data["recommendations"]) > 3:
            raise ValueError("AI returned more than 3 recommendations.")

        # Step 3: Build a lookup of allowed products.
        # This ensures the AI can only return real candidate products.
        product_lookup: Dict[str, Product] = {
            product.id: product for product in candidate_products
        }

        seen_product_ids: Set[str] = set()
        validated_items: List[RecommendationItem] = []

        # Step 4: Validate each recommendation item.
        for item in parsed_data["recommendations"]:
            if not isinstance(item, dict):
                raise ValueError("Each recommendation must be an object.")

            product_id = str(item.get("product_id", "")).strip()
            product_name = str(item.get("product_name", "")).strip()
            reason = str(item.get("reason", "")).strip()
            match_score = item.get("match_score")

            # Product ID must exist in candidate products.
            if not product_id:
                raise ValueError("Recommendation is missing product_id.")

            if product_id not in product_lookup:
                raise ValueError(f"AI returned an unknown product_id: {product_id}")

            # No duplicate products allowed.
            if product_id in seen_product_ids:
                raise ValueError(f"Duplicate recommendation found: {product_id}")

            seen_product_ids.add(product_id)

            # Product name must match the real catalog product.
            real_product = product_lookup[product_id]
            if product_name != real_product.name:
                raise ValueError(
                    f"Product name mismatch for product_id '{product_id}'. "
                    f"Expected '{real_product.name}', got '{product_name}'."
                )

            # Reason must not be empty.
            if not reason:
                raise ValueError(f"Recommendation reason is empty for {product_id}.")

            # Match score must be an integer from 0 to 100.
            if not isinstance(match_score, int):
                raise ValueError(f"match_score must be an integer for {product_id}.")

            if match_score < 0 or match_score > 100:
                raise ValueError(
                    f"match_score must be between 0 and 100 for {product_id}."
                )

            # If all checks pass, create the validated recommendation item.
            validated_items.append(
                RecommendationItem(
                    product_id=product_id,
                    product_name=product_name,
                    match_score=match_score,
                    reason=reason,
                )
            )

        # Step 5: Return the final validated response.
        return RecommendationResponse(
            summary=str(parsed_data["summary"]).strip(),
            recommendations=validated_items,
        )