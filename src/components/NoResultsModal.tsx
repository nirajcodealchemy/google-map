import { useEffect } from "react";
import { MapPin, X } from "lucide-react";

type Props = {
  location: string;
  categoryLabel: string;
  onClose: () => void;
};

export default function NoResultsModal({
  location,
  categoryLabel,
  onClose,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="no-results-title"
        aria-describedby="no-results-description"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <MapPin size={22} />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close message"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <X size={19} />
          </button>
        </div>

        <h2
          id="no-results-title"
          className="mt-4 text-lg font-bold text-slate-900"
        >
          No nearby places found
        </h2>
        <p
          id="no-results-description"
          className="mt-2 text-sm leading-6 text-slate-600"
        >
          We couldn’t find any {categoryLabel.toLowerCase()} near {location}.
          Try another place, category, or a larger search radius.
        </p>

        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          Change search
        </button>
      </section>
    </div>
  );
}
