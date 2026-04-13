import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { RecommendationRequest } from "../../types/recommendation";

interface QuizFormProps {
  onSubmit: (values: RecommendationRequest) => Promise<void> | void;
  isLoading: boolean;
}

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

const initialFormData: RecommendationRequest = {
  budget_band: "mid",
  main_goal: "daily_jogging",
  experience_level: "beginner",
  priority: "comfort",
  terrain: "road",
  needs_extra_support: false,
  fit_preference: "regular",
};

const budgetOptions: SelectOption<RecommendationRequest["budget_band"]>[] = [
  { value: "budget", label: "Budget (value focused)" },
  { value: "mid", label: "Mid-range (balanced)" },
  { value: "premium", label: "Premium (top-tier tech)" },
];

const goalOptions: SelectOption<RecommendationRequest["main_goal"]>[] = [
  { value: "daily_jogging", label: "Daily jogging" },
  { value: "speed_training", label: "Speed training" },
  { value: "trail_running", label: "Trail running" },
  { value: "race_day", label: "Race day performance" },
];

const experienceOptions: SelectOption<
  RecommendationRequest["experience_level"]
>[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const priorityOptions: SelectOption<RecommendationRequest["priority"]>[] = [
  { value: "comfort", label: "Comfort" },
  { value: "speed", label: "Speed" },
  { value: "support", label: "Support" },
  { value: "value", label: "Best value" },
];

const terrainOptions: SelectOption<RecommendationRequest["terrain"]>[] = [
  { value: "road", label: "Road" },
  { value: "trail", label: "Trail" },
];

const fitOptions: SelectOption<RecommendationRequest["fit_preference"]>[] = [
  { value: "regular", label: "Regular fit" },
  { value: "wide", label: "Wide fit" },
  { value: "narrow", label: "Narrow fit" },
];

interface SelectFieldProps<T extends string> {
  id: string;
  label: string;
  hint: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}

function SelectField<T extends string>({
  id,
  label,
  hint,
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <div className="form-control">
      <label htmlFor={id} className="form-control__label">
        {label}
      </label>
      <p className="form-control__hint">{hint}</p>
      <div className="form-control__select-wrap">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="form-control__select"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
  const [formData, setFormData] = useState<RecommendationRequest>(initialFormData);
  const baseId = useId();

  function handleChange<K extends keyof RecommendationRequest>(
    field: K,
    value: RecommendationRequest[K]
  ) {
    setFormData((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      <header className="quiz-form__header">
        <p className="quiz-form__eyebrow">Runner Profile</p>
        <h2 id="quiz-heading" className="quiz-form__title">
          Tell us how you run
        </h2>
        <p className="quiz-form__description">
          Build your profile so the engine can prioritize cushioning, ride feel,
          support, and fit for your exact needs.
        </p>
      </header>

      <fieldset className="quiz-form__group">
        <legend className="quiz-form__legend">Performance preferences</legend>
        <div className="quiz-form__grid">
          <SelectField
            id={`${baseId}-budget`}
            label="Budget range"
            hint="Choose the price segment that best matches your buying intent."
            value={formData.budget_band}
            options={budgetOptions}
            onChange={(value) => handleChange("budget_band", value)}
          />
          <SelectField
            id={`${baseId}-goal`}
            label="Primary running goal"
            hint="This decides how much we weight energy return and responsiveness."
            value={formData.main_goal}
            options={goalOptions}
            onChange={(value) => handleChange("main_goal", value)}
          />
          <SelectField
            id={`${baseId}-priority`}
            label="Top priority"
            hint="Pick the factor you care about most in your next pair."
            value={formData.priority}
            options={priorityOptions}
            onChange={(value) => handleChange("priority", value)}
          />
          <SelectField
            id={`${baseId}-terrain`}
            label="Terrain"
            hint="Road and trail shoes use different outsole and stability designs."
            value={formData.terrain}
            options={terrainOptions}
            onChange={(value) => handleChange("terrain", value)}
          />
        </div>
      </fieldset>

      <fieldset className="quiz-form__group">
        <legend className="quiz-form__legend">Fit and support</legend>
        <div className="quiz-form__grid">
          <SelectField
            id={`${baseId}-experience`}
            label="Experience level"
            hint="Helps tune recommendations for training load and confidence."
            value={formData.experience_level}
            options={experienceOptions}
            onChange={(value) => handleChange("experience_level", value)}
          />
          <SelectField
            id={`${baseId}-fit`}
            label="Fit preference"
            hint="Choose the width profile that usually feels best to you."
            value={formData.fit_preference}
            options={fitOptions}
            onChange={(value) => handleChange("fit_preference", value)}
          />
        </div>

        <div className="quiz-checkbox">
          <input
            id={`${baseId}-support`}
            className="quiz-checkbox__input"
            type="checkbox"
            checked={formData.needs_extra_support}
            onChange={(event) =>
              handleChange("needs_extra_support", event.target.checked)
            }
          />
          <label htmlFor={`${baseId}-support`} className="quiz-checkbox__label">
            <span className="quiz-checkbox__title">
              I need extra stability support
            </span>
            <span className="quiz-checkbox__description">
              Useful for runners who prefer added guidance through each stride.
            </span>
          </label>
        </div>
      </fieldset>

      <button type="submit" disabled={isLoading} className="quiz-form__submit">
        {isLoading ? "Analyzing your profile..." : "Get my shoe matches"}
      </button>

      <p className="quiz-form__disclaimer">
        You can update your answers anytime to refine your recommendations.
      </p>
    </form>
  );
}
