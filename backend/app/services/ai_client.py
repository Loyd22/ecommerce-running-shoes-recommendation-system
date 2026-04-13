"""AI client placeholder."""
# backend/app/services/ai_client.py

from openai import OpenAI

from app.core.config import settings


class AIClient:
    """
    This service is responsible for talking to the AI model.

    We keep this in a separate file so the rest of the backend
    does not need to know the low-level details of the OpenAI call.
    """

    def __init__(self) -> None:
        """
        Create the OpenAI client using the API key from settings.
        """
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL

    def get_recommendation(self, prompt: str) -> str:
        """
        Send the prompt to the AI model and return the raw text response.

        Args:
            prompt: The full prompt string built by recommendation_prompt.py

        Returns:
            The raw text output from the AI model
        """
        response = self.client.chat.completions.create(
            model=self.model,
            temperature=0,  # lower temperature for more controlled output
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a careful assistant that follows instructions exactly "
                        "and returns structured JSON when requested."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )

        # Return the model's text output
        return response.choices[0].message.content.strip()