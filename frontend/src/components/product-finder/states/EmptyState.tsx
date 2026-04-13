export default function EmptyState() {
  return (
    <section className="state-card state-card--empty">
      <h3 className="state-card__title">Start your personalized shoe match</h3>
      <p className="state-card__copy">
        Complete the profile form and we will generate recommendations tuned to
        your running goals, terrain, fit preference, and support needs.
      </p>
      <ul className="state-card__list">
        <li>Profile-based ranking with fit score</li>
        <li>Clear rationale for every recommendation</li>
        <li>Fast results you can refine anytime</li>
      </ul>
    </section>
  );
}
