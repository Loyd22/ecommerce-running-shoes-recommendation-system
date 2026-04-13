// Quiz form component placeholder.
// frontend/src/components/product-finder/QuizForm.tsx

import { useState } from "react";
import type{ RecommendationRequest } from "../../types/recommendation";

interface QuizFormProps {
  onSubmit: (values: RecommendationRequest) => void;
  isLoading: boolean;
}

export default function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
  // This state stores all quiz answers.
  const [formData, setFormData] = useState<RecommendationRequest>({
    budget_band: "mid",
    main_goal: "daily_jogging",
    experience_level: "beginner",
    priority: "comfort",
    terrain: "road",
    needs_extra_support: false,
    fit_preference: "regular",
  });

  // Update one field inside the form.
  function handleChange<K extends keyof RecommendationRequest>(
    field: K,
    value: RecommendationRequest[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Submit the form to the parent page.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6 bg-white">
      <h2 className="text-xl font-semibold">Find Your Running Shoe</h2>

      <div>
        <label className="block mb-1 font-medium">Budget</label>
        <select
          value={formData.budget_band}
          onChange={(e) => handleChange("budget_band", e.target.value as RecommendationRequest["budget_band"])}
          className="w-full rounded border p-2"
        >
          <option value="budget">Budget</option>
          <option value="mid">Mid</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Main Goal</label>
        <select
          value={formData.main_goal}
          onChange={(e) => handleChange("main_goal", e.target.value as RecommendationRequest["main_goal"])}
          className="w-full rounded border p-2"
        >
          <option value="daily_jogging">Daily Jogging</option>
          <option value="speed_training">Speed Training</option>
          <option value="trail_running">Trail Running</option>
          <option value="race_day">Race Day</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Experience Level</label>
        <select
          value={formData.experience_level}
          onChange={(e) => handleChange("experience_level", e.target.value as RecommendationRequest["experience_level"])}
          className="w-full rounded border p-2"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => handleChange("priority", e.target.value as RecommendationRequest["priority"])}
          className="w-full rounded border p-2"
        >
          <option value="comfort">Comfort</option>
          <option value="speed">Speed</option>
          <option value="support">Support</option>
          <option value="value">Value</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Terrain</label>
        <select
          value={formData.terrain}
          onChange={(e) => handleChange("terrain", e.target.value as RecommendationRequest["terrain"])}
          className="w-full rounded border p-2"
        >
          <option value="road">Road</option>
          <option value="trail">Trail</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Fit Preference</label>
        <select
          value={formData.fit_preference}
          onChange={(e) => handleChange("fit_preference", e.target.value as RecommendationRequest["fit_preference"])}
          className="w-full rounded border p-2"
        >
          <option value="regular">Regular</option>
          <option value="wide">Wide</option>
          <option value="narrow">Narrow</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="needs_extra_support"
          type="checkbox"
          checked={formData.needs_extra_support}
          onChange={(e) => handleChange("needs_extra_support", e.target.checked)}
        />
        <label htmlFor="needs_extra_support" className="font-medium">
          I need extra support
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
      </button>
    </form>
  );
}