import type { RecommendationResponse } from "../../types/recommendation";
import RecommendationCard from "./RecommendationCard";

interface RecommendationListProps {
  data: RecommendationResponse;
}

export default function RecommendationList({ data }: RecommendationListProps) {
  const recommendationCount = data.recommendations.length;

  return (
    <div className="recommendation-list">
      <section className="result-summary">
        <div className="result-summary__chips">
          <span className="result-chip result-chip--accent">AI tailored</span>
          <span className="result-chip">{recommendationCount} matches found</span>
          <span className="result-chip result-chip--muted">
            {data.request_id ? `Request #${data.request_id}` : "Session active"}
          </span>
        </div>
        <h3 className="result-summary__title">Why these shoes are recommended</h3>
        <p className="result-summary__copy">{data.summary}</p>
      </section>

      <div className="recommendation-list__cards">
        {data.recommendations.map((item, index) => (
          <RecommendationCard key={item.product_id} item={item} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
