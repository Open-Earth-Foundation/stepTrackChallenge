import { FC } from "react";
import { Period } from "@shared/schema";

interface PeriodSelectorProps {
  period: Period;
  onChange: (period: Period) => void;
}

const PeriodSelector: FC<PeriodSelectorProps> = ({ period, onChange }) => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm p-2 inline-flex">
        <button
          className={`py-2 px-6 rounded-lg font-medium transition-colors ${period === "week"
            ? "text-white bg-primary"
            : "text-neutral-500 hover:text-neutral-800"
            }`}
          onClick={() => onChange("week")}
        >
          Week
        </button>
        <button
          className={`py-2 px-6 rounded-lg font-medium transition-colors ${period === "month"
            ? "text-white bg-primary"
            : "text-neutral-500 hover:text-neutral-800"
            }`}
          onClick={() => onChange("month")}
        >
          Month
        </button>
      </div>
    </div>
  );
};

export default PeriodSelector;
