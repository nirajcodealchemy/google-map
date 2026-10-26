import { PLACE_CATEGORIES } from "../types/place";
import type { PlaceCategory } from "../types/place";
import { Banknote, Coffee, Hospital, Utensils } from "lucide-react";

const categoryIcons = {
  restaurant: Utensils,
  cafe: Coffee,
  hospital: Hospital,
  atm: Banknote,
} satisfies Record<PlaceCategory, typeof Utensils>;

type Props = {
  category: PlaceCategory;
  onChange: (category: PlaceCategory) => void;
};

export default function CategoryFilters({ category, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PLACE_CATEGORIES.map((item) => {
        const active = category === item.value;
        const Icon = categoryIcons[item.value];

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            aria-pressed={active}
            className={`rounded-xl cursor-pointer border p-3 text-left transition ${
              active
                ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
            }`}
          >
            <Icon size={20} />
            <span className="mt-2 block text-sm font-semibold">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
