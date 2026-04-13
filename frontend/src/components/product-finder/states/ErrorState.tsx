interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="state-card state-card--error" role="alert">
      <h3 className="state-card__title">We could not load recommendations</h3>
      <p className="state-card__copy">{message}</p>
      {onRetry && (
        <button type="button" className="state-card__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  );
}
