import { MouseEventHandler } from "react";
import { PlaceDetails } from "../../_shared/gameLogic";
import StyleHelper from "./styleHelpers";
import { Color } from "../../_shared/gameLogic";
import PlacedCard from "./PlacedCard";

interface BoardProps {
  board: PlaceDetails[][];
  handlePlacement: (x: number, y: number) => MouseEventHandler<HTMLDivElement>;
  debug?: boolean;
}

export default function Board({
  board,
  handlePlacement,
  debug = false,
}: BoardProps) {
  return (
    <div
      className={`grid ${StyleHelper.numGridColsString(
        board[0].length
      )} w-full gap-1`}
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
                // debug={debug}
                // coords={{ x: j, y: i }}
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
      className="bg-gray-100 rounded-lg aspect-square active:ring active:ring-gray-400 focus:ring focus:ring-gray-400 hover:bg-gray-200 "
      onClick={onClick}
    ></div>
  );
}

function ClosedPlace() {
  return <div className="aspect-square"></div>;
}

// interface PlacedCardProps {
//   value: number;
//   color: Color;
//   onClick: MouseEventHandler<HTMLDivElement>;
//   debug: boolean;
//   coords: { x: number; y: number };
// }

// function PlacedCard({ value, color, onClick, debug, coords }: PlacedCardProps) {
//   return (
//     <div
//       className="border flex flex-col justify-center items-center rounded-xl border-grey-500 hover:bg-blue-900"
//       onClick={onClick}
//     >
//       {debug && (
//         <p className="text-xs">
//           {coords.x},{coords.y}
//         </p>
//       )}
//       <p
//         className={`${StyleHelper.colorTextStyle(
//           color
//         )} text-xl text-center aspect-square`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }
