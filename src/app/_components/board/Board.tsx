import { Card, PlaceDetails } from "../../_shared/gameLogic";
import StyleHelper from "./styleHelpers";
import PlacedCard from "./PlacedCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BoardProps {
  board?: PlaceDetails[][];
  debug?: boolean;
  interactive?: boolean;
  card?: Card;
  formAction?: (formData: FormData) => Promise<void>;
  className?: string;
}

export default function Board({
  board,
  formAction,
  className,
  debug = false,
  interactive = true,
}: BoardProps) {
  if (!board)
    return (
      <div className={cn("grid grid-cols-11 gap-1 aspect-square",className)}>
        {[...Array(121)].map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    );

  return (
    <form
      className={cn(`grid grid-cols-11 gap-1 aspect-square`, className)}
      action={formAction || ((formData: FormData) => {})}
    >
      {board.map((row, i) =>
        row.map((place, j) => {
          if (!!place.card) {
            return (
              <PlacedCard
                interactive={interactive}
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
            return <OpenPlace  key={`x:${j} y:${i}`} x={j} y={i} interactive={interactive}/>;
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
  interactive: boolean;
}

function OpenPlace({ x, y, interactive }: OpenPlaceProps) {
  return (
    <button
      className={cn("bg-gray-100 rounded-lg aspect-square w-full h-full",
      interactive ? "active:ring active:ring-gray-400 focus:ring focus:ring-gray-400 hover:bg-gray-200" : "")}
      type="submit"
      name="position"
      value={JSON.stringify({ x, y })}
      disabled={!interactive}
    ></button>
  );
}

function ClosedPlace() {
  return <div className="aspect-square"></div>;
}
