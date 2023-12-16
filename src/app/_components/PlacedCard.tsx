import { MouseEventHandler } from "react";
import { Color } from "../_hooks/GameLogic";
import StyleHelper from "./styleHelpers";

interface PlacedCardProps {
  value: number;
  color: Color;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function PlacedCard({ value, color, onClick }: PlacedCardProps) {
  return (
    <div
      className="border flex flex-col justify-center items-center rounded-xl border-grey-500 hover:bg-blue-900"
      onClick={onClick}
    >
      <p
        className={`${StyleHelper.colorTextStyle(
          color
        )} text-xl text-center aspect-square`}
      >
        {value}
      </p>
    </div>
  );
}
