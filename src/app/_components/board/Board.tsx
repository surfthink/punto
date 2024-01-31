import { PlaceDetails } from "../../_shared/gameLogic";
import StyleHelper from "./styleHelpers";
import PlacedCard from "./PlacedCard";
import { Skeleton } from "@/components/ui/skeleton";
import { place as handlePlacement } from "@/app/_actions/place";

interface BoardProps {
  board?: PlaceDetails[][];
  debug?: boolean;
}

export default function Board({ board, debug = false }: BoardProps) {
  if (!board)
    return (
      <div className="grid grid-cols-11 gap-1 aspect-square h-full">
        {[...Array(121)].map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    );

  return (
    <form
      className={`grid ${StyleHelper.numGridColsString(
        board[0].length
      )} gap-1 aspect-square h-full`}
    >
      {board.map((row, i) =>
        row.map((place, j) => {
          if (!!place.card) {
            return (
              <PlacedCard
                value={place.card.value}
                color={place.card.color}
                key={`x:${j} y:${i}`}
                formAction={handlePlacement.bind(null, j, i)}
              />
            );
          }
          if (!place.card && place.state == "open") {
            return (
              <OpenPlace
                key={`x:${j} y:${i}`}
                formAction={handlePlacement.bind(null, j, i)}
              />
            );
          }
          if (!place.card && place.state == "closed") {
            return <ClosedPlace key={`x:${j} y:${i}`} />;
          }
        })
      )}
    </form>
  );
}

interface OpenPlaceProps {
  formAction: () => void;
}

function OpenPlace({ formAction }: OpenPlaceProps) {
  return (
    <button
      className="bg-gray-100 rounded-lg aspect-square active:ring active:ring-gray-400 focus:ring focus:ring-gray-400 hover:bg-gray-200 w-full h-full"
      formAction={formAction}
    ></button>
  );
}

function ClosedPlace() {
  return <div className="aspect-square"></div>;
}
