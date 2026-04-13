// Recommendation list component placeholder.
// frontend/src/components/product-finder/RecommendationList.tsx

import type { RecommendationResponse } from "../../types/recommendation";
import RecommendationCard from "./RecommendationCard";

interface RecommendationListProps {
  data: RecommendationResponse;
}

export default function RecommendationList({ data }: RecommendationListProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 bg-white">
        <h2 className="text-xl font-semibold">Recommendation Summary</h2>
        <p className="mt-2 text-gray-700">{data.summary}</p>
      </div>

      <div className="space-y-3">
        {data.recommendations.map((item) => (
          <RecommendationCard key={item.product_id} item={item} />
        ))}
      </div>
    </div>
  );
}