// frontend/src/types/recommendation.ts

export interface RecommendationRequest {
  budget_band: "budget" | "mid" | "premium";
  main_goal: "daily_jogging" | "speed_training" | "trail_running" | "race_day";
  experience_level: "beginner" | "intermediate" | "advanced";
  priority: "comfort" | "speed" | "support" | "value";
  terrain: "road" | "trail";
  needs_extra_support: boolean;
  fit_preference: "regular" | "wide" | "narrow";
}

export interface RecommendationItem {
  product_id: string;
  product_name: string;
  match_score: number;
  reason: string;
}

export interface RecommendationResponse {
  request_id?: string | null;
  summary: string;
  recommendations: RecommendationItem[];
}