import { MouseEventHandler } from "react";
import { PlaceDetails } from "../../_shared/gameLogic";
import StyleHelper from "./styleHelpers";
import { Color } from "../../_shared/gameLogic";

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

interface OpenPlaceProps {
  onClick: MouseEventHandler<HTMLDivElement>;
}

function OpenPlace({ onClick }: OpenPlaceProps) {
  return (
    <div
      className="border border-blue-800 hover:bg-blue-900 aspect-square"
      onClick={onClick}
    ></div>
  );
}

function ClosedPlace() {
  return <div className="border border-gray-900 aspect-square"></div>;
}

interface PlacedCardProps {
  value: number;
  color: Color;
  onClick: MouseEventHandler<HTMLDivElement>;
}

function PlacedCard({ value, color, onClick }: PlacedCardProps) {
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
