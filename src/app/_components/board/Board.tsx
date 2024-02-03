import { Card, PlaceDetails } from "../../_shared/gameLogic";
import StyleHelper from "./styleHelpers";
import PlacedCard from "./PlacedCard";
import { Skeleton } from "@/components/ui/skeleton";

interface BoardProps {
  board?: PlaceDetails[][];
  debug?: boolean;
  card?: Card;
  formAction?: (formData: FormData) => Promise<void>;
}

export default function Board({
  board,
  formAction,
  debug = false,
}: BoardProps) {
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
      action={formAction || ((formData: FormData) => {})}
    >
      {board.map((row, i) =>
        row.map((place, j) => {
          if (!!place.card) {
            return (
              <PlacedCard
                value={{
                  value: place.card.value,
                  color: place.card.color,
                  x: j,
                  y: i,
                }}
                key={`x:${j} y:${i}`}
              />
            );
          }
          if (!place.card && place.state == "open") {
            return <OpenPlace key={`x:${j} y:${i}`} x={j} y={i} />;
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
  x: number;
  y: number;
}

function OpenPlace({ x, y }: OpenPlaceProps) {
  return (
    <button
      className="bg-gray-100 rounded-lg aspect-square active:ring active:ring-gray-400 focus:ring focus:ring-gray-400 hover:bg-gray-200 w-full h-full"
      type="submit"
      name="position"
      value={JSON.stringify({ x, y })}
    ></button>
  );
}

function ClosedPlace() {
  return <div className="aspect-square"></div>;
}
