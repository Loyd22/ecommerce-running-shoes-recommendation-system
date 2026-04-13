// frontend/src/services/recommendationApi.ts

import type {
  RecommendationRequest,
  RecommendationResponse,
} from "../types/recommendation";

// Use the environment variable if it exists.
// Otherwise, fall back to localhost for development.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export async function fetchRecommendations(
  payload: RecommendationRequest
): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch recommendations.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Keep default message if backend error JSON cannot be parsed
    }

    throw new Error(errorMessage);
  }

  return response.json();
}