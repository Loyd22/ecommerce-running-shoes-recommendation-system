"""Recommendation prompt placeholder."""
# backend/app/prompts/recommendation_prompt.py

import json
from typing import List

from app.schemas.product import Product
from app.schemas.recommendation import RecommendationRequest


def build_recommendation_prompt(
    shopper_input: RecommendationRequest,
    candidate_products: List[Product],
) -> str:
    """
    Build the prompt that will be sent to the AI model.

    This prompt is designed to keep the AI controlled and reliable.
    The AI is only allowed to recommend products from the candidate list
    provided by the backend.

    Args:
        shopper_input: The validated shopper quiz answers
        candidate_products: The filtered products chosen by the backend

    Returns:
        A complete prompt string for the AI model
    """

    # Convert the shopper input into formatted JSON text
    # This makes the prompt cleaner and easier for the model to read.
    shopper_input_json = json.dumps(
        shopper_input.model_dump(),
        indent=2,
        ensure_ascii=False,
    )

    # Convert candidate products into formatted JSON text
    # This gives the model the only products it is allowed to use.
    candidate_products_json = json.dumps(
        [product.model_dump() for product in candidate_products],
        indent=2,
        ensure_ascii=False,
    )

    # Build a strict instruction prompt
    # The wording is designed to reduce hallucination and force structure.
    prompt = f"""
You are a product recommendation assistant for a running shoe product finder.

Your task is to recommend the best running shoes for the shopper.

You must follow these rules very strictly:

1. Only use products from the provided CANDIDATE_PRODUCTS list.
2. Do not invent any product ID, product name, brand, feature, or reason outside the given data.
3. Recommend at most 3 products.
4. Return JSON only.
5. Do not return markdown.
6. Do not return explanations outside the JSON.
7. Each recommendation must include:
   - product_id
   - product_name
   - match_score
   - reason
8. Include one top-level summary field.
9. match_score must be an integer from 0 to 100.
10. reason must be short, clear, and specific to the shopper's needs.
11. Do not recommend duplicate products.
12. If there are fewer than 3 strong matches, return fewer than 3.
13. Base the ranking on the shopper input and the candidate products only.

SHOPPER_INPUT:
{shopper_input_json}

CANDIDATE_PRODUCTS:
{candidate_products_json}

Return exactly this JSON structure:

{{
  "summary": "short overall recommendation summary",
  "recommendations": [
    {{
      "product_id": "shoe_001",
      "product_name": "Example Shoe",
      "match_score": 92,
      "reason": "Short reason why this shoe matches the shopper."
    }}
  ]
}}

Important:
- The product_id must exactly match a real product from CANDIDATE_PRODUCTS.
- The product_name must exactly match the matching product_id.
- Do not include any extra fields.
- Do not include any text before or after the JSON.
""".strip()

    return prompt