export default function LoadingState() {
  return (
    <section className="state-card state-card--loading" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <h3 className="state-card__title">Analyzing your runner profile</h3>
      <p className="state-card__copy">
        Comparing cushioning, support, and ride characteristics to identify your
        highest-fit models.
      </p>

      <div className="loading-skeleton" aria-hidden="true">
        <span className="loading-skeleton__line loading-skeleton__line--full" />
        <span className="loading-skeleton__line loading-skeleton__line--mid" />
        <span className="loading-skeleton__line loading-skeleton__line--short" />
      </div>
    </section>
  );
}
