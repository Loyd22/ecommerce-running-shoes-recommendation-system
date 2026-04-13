import { useState } from "react";
import QuizForm from "../components/product-finder/QuizForm";
import RecommendationList from "../components/product-finder/RecommendationList";
import EmptyState from "../components/product-finder/states/EmptyState";
import ErrorState from "../components/product-finder/states/ErrorState";
import LoadingState from "../components/product-finder/states/LoadingState";
import { fetchRecommendations } from "../services/recommendationApi";
import type {
  RecommendationRequest,
  RecommendationResponse,
} from "../types/recommendation";

export default function ProductFinderPage() {
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<RecommendationRequest | null>(
    null
  );

  async function handleSubmit(values: RecommendationRequest) {
    try {
      setIsLoading(true);
      setError(null);
      setLastRequest(values);

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

  function handleRetry() {
    if (!lastRequest) {
      return;
    }

    void handleSubmit(lastRequest);
  }

  return (
    <main className="pf-page">
      <div className="pf-shell">
        <header className="pf-hero" role="banner">
          <p className="pf-hero__eyebrow">Global Running Product Finder</p>
          <h1 className="pf-hero__title">
            Find your next high-performance running shoe in under a minute
          </h1>
          <p className="pf-hero__subtitle">
            Our recommendation engine analyzes your runner profile, performance
            goals, and fit needs to surface shoes with the strongest match for
            your routine.
          </p>
          <div className="pf-hero__stats" aria-label="Product finder highlights">
            <div className="pf-stat">
              <span className="pf-stat__value">7-point fit profile</span>
              <span className="pf-stat__label">Runner-specific inputs</span>
            </div>
            <div className="pf-stat">
              <span className="pf-stat__value">AI-ranked matches</span>
              <span className="pf-stat__label">Clear score breakdown</span>
            </div>
            <div className="pf-stat">
              <span className="pf-stat__value">Instant guidance</span>
              <span className="pf-stat__label">No signup required</span>
            </div>
          </div>
        </header>

        <section className="pf-grid">
          <section className="pf-panel pf-panel--quiz" aria-labelledby="quiz-heading">
            <QuizForm onSubmit={handleSubmit} isLoading={isLoading} />
          </section>

          <section
            className="pf-panel pf-panel--results"
            aria-live="polite"
            aria-labelledby="results-heading"
          >
            <header className="pf-panel__header">
              <p className="pf-panel__eyebrow">Recommendation Engine</p>
              <h2 id="results-heading" className="pf-panel__title">
                Your shoe matches
              </h2>
              <p className="pf-panel__description">
                You will see ranked models, fit scores, and reasoning tied to
                your profile as soon as we process your answers.
              </p>
            </header>

            {isLoading && <LoadingState />}
            {!isLoading && error && (
              <ErrorState message={error} onRetry={lastRequest ? handleRetry : undefined} />
            )}
            {!isLoading && !error && result && <RecommendationList data={result} />}
            {!isLoading && !error && !result && <EmptyState />}
          </section>
        </section>
      </div>
    </main>
  );
}
