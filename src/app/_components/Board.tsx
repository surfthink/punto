import { MouseEventHandler } from "react";
import ClosedPlace from "./ClosedPlace";
import OpenPlace from "./OpenPlace";
import PlacedCard from "./PlacedCard";
import { Color, PlaceDetails } from "./GameLogic";
import StyleHelper from "./styleHelpers";

interface BoardProps {
  board: PlaceDetails[][];
  handlePlacement: (x: number, y: number) => MouseEventHandler<HTMLDivElement>; //it would be nice to have this function take in placement information
}

export default function Board({ board, handlePlacement }: BoardProps) {
  return (
    <div
      className={`grid ${StyleHelper.numGridColsString(
        board[0].length
      )} w-full`}
    >
      {board.map((row, i) =>
        row.map((place, j) => {
          if (!!place.card) {
            return (
              <PlacedCard
                value={place.card.value}
                color={place.card.color}
                key={`x:${j} y:${i}`}
                onClick={handlePlacement(j, i)}
              />
            );
          }
          if (!place.card && place.state == "open") {
            return (
              <OpenPlace
                key={`x:${j} y:${i}`}
                onClick={handlePlacement(j, i)}
              />
            );
          }
          if (!place.card && place.state == "closed") {
            return <ClosedPlace key={`x:${j} y:${i}`} />;
          }
        })
      )}
    </div>
  );
}
