// Product Finder page placeholder.
// frontend/src/pages/ProductFinderPage.tsx

import { useState } from "react";
import QuizForm from "../components/product-finder/QuizForm";
import RecommendationList from "../components/product-finder/RecommendationList";
import { fetchRecommendations } from "../services/recommendationApi";
import type{
  RecommendationRequest,
  RecommendationResponse,
} from "../types/recommendation";

export default function ProductFinderPage() {
  // Store successful recommendation results here.
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  // Store loading state while waiting for the backend.
  const [isLoading, setIsLoading] = useState(false);

  // Store user-friendly error message here.
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: RecommendationRequest) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchRecommendations(values);
      setResult(response);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching recommendations.";

      setError(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Running Shoe Product Finder</h1>
          <p className="text-gray-600">
            Answer a few questions and get AI-assisted running shoe recommendations.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <QuizForm onSubmit={handleSubmit} isLoading={isLoading} />

          <div>
            {isLoading && (
              <div className="rounded-lg border bg-white p-4">
                <p className="text-gray-700">Loading recommendations...</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="font-medium text-red-700">Error</p>
                <p className="mt-1 text-red-600">{error}</p>
              </div>
            )}

            {!isLoading && !error && result && (
              <RecommendationList data={result} />
            )}

            {!isLoading && !error && !result && (
              <div className="rounded-lg border bg-white p-4">
                <p className="text-gray-600">
                  Your recommendations will appear here after you complete the quiz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}