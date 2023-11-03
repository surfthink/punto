import { Color } from "./GameLogic";
import StyleHelper from "./styleHelpers";

interface PlacedCardProps {
  value: number;
  color: Color;
}

export default function PlacedCard({ value, color }: PlacedCardProps) {
  return (
    <div className="border border-grey-500">
      <p className={`${StyleHelper.colorTextStyle(color)} text-xl`}>{value}</p>
    </div>
  );
}
