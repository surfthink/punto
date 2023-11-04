import { MouseEventHandler } from "react";
import { Color } from "./GameLogic";
import StyleHelper from "./styleHelpers";

interface PlacedCardProps {
  value: number;
  color: Color;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function PlacedCard({ value, color, onClick }: PlacedCardProps) {
  return (
    <div className="border border-grey-500" onClick={onClick}>
      <p className={`${StyleHelper.colorTextStyle(color)} text-xl`}>{value}</p>
    </div>
  );
}
