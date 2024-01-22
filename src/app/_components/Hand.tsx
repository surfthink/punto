import { Color } from "../_shared/gameLogic";
import PlacedCard from "./board/PlacedCard";
import StyleHelper from "./board/styleHelpers";

interface HandProps {
  //needs to be told the card informationS
  color: Color;
  value: number;
}

export default function Hand({ color, value }: HandProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[50px]">
        <PlacedCard value={value} color={color}></PlacedCard>
      </div>
    </div>
  );
}
