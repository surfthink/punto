import { Color } from "../_hooks/GameLogic";
import StyleHelper from "./styleHelpers";

interface HandProps {
  //needs to be told the card information
  color: Color;
  value: number;
}

export default function Hand({ color, value }: HandProps) {
  return (
    <div className="border">
      <p>Players Hand</p>
      <h1 className={`${StyleHelper.colorTextStyle(color)} text-lg`}>
        {value}
      </h1>
    </div>
  );
}
