export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="w-8 h-8 border-2 border-cream-dark border-t-accent rounded-full animate-spin" />
      <p className="text-muted text-sm font-sans">{message}</p>
    </div>
  );
}
