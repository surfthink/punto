import { Color } from "../_shared/gameLogic";
import StyleHelper from "./board/styleHelpers";

interface HandProps {
  //needs to be told the card informationS
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
