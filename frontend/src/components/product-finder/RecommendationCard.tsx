// Recommendation card component placeholder.
// frontend/src/components/product-finder/RecommendationCard.tsx

import type { RecommendationItem } from "../../types/recommendation";

interface RecommendationCardProps {
  item: RecommendationItem;
}

export default function RecommendationCard({ item }: RecommendationCardProps) {
  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{item.product_name}</h3>
        <span className="rounded bg-gray-100 px-2 py-1 text-sm font-medium">
          {item.match_score}/100
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500">Product ID: {item.product_id}</p>

      <p className="mt-3 text-gray-700">{item.reason}</p>
    </div>
  );
}