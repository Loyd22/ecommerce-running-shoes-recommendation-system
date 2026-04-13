import type { RecommendationItem } from "../../types/recommendation";

interface RecommendationCardProps {
  item: RecommendationItem;
  rank: number;
}

function getConfidenceLabel(score: number) {
  if (score >= 90) {
    return "Exceptional profile match";
  }

  if (score >= 80) {
    return "Strong profile match";
  }

  if (score >= 70) {
    return "Solid profile match";
  }

  return "Potential fit";
}

function getScoreTone(score: number) {
  if (score >= 85) {
    return "high";
  }

  if (score >= 70) {
    return "medium";
  }

  return "low";
}

export default function RecommendationCard({ item, rank }: RecommendationCardProps) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(item.match_score)));
  const confidenceLabel = getConfidenceLabel(normalizedScore);
  const scoreTone = getScoreTone(normalizedScore);

  return (
    <article className="recommendation-card">
      <header className="recommendation-card__header">
        <div className="recommendation-card__identity">
          <p className="recommendation-card__rank">Match {rank}</p>
          <h3 className="recommendation-card__name">{item.product_name}</h3>
        </div>

        <div className={`score-pill score-pill--${scoreTone}`}>
          <span className="score-pill__value">{normalizedScore}</span>
          <span className="score-pill__label">Fit score</span>
        </div>
      </header>

      <div className="recommendation-card__meter" aria-hidden="true">
        <span
          className="recommendation-card__meter-fill"
          style={{ width: `${normalizedScore}%` }}
        />
      </div>

      <p className="recommendation-card__confidence">{confidenceLabel}</p>

      <div className="recommendation-card__body">
        <p className="recommendation-card__why-title">
          Why this model fits your profile
        </p>
        <p className="recommendation-card__reason">{item.reason}</p>
      </div>

      <footer className="recommendation-card__footer">
        <p className="recommendation-card__product-id">
          Product ID: {item.product_id}
        </p>
      </footer>
    </article>
  );
}
