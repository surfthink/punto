import { Color } from "@/app/_shared/gameLogic";
import { cn } from "@/lib/utils";

interface PlacedCardProps 
  {
    value: { value: number; color: Color; x?: number; y?: number };
    interactive: boolean;
  }

export default function PlacedCard({value,interactive=true}: PlacedCardProps
) {
  switch (value.value) {
    case 1:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-2 row-start-2"
          ></Dot>
        </Grid>
      );
    case 2:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-3"
          ></Dot>
        </Grid>
      );
    case 3:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-2 row-start-2"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-3"
          ></Dot>
        </Grid>
      );
    case 4:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-3"
          ></Dot>
        </Grid>
      );
    case 5:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-2 row-start-2"
          ></Dot>
        </Grid>
      );
    case 6:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-2"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-2"
          ></Dot>
        </Grid>
      );
    case 7:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-2"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-2"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-2 row-start-2"
          ></Dot>
        </Grid>
      );
    case 8:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-2"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-2"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-2 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-2 row-start-3"
          ></Dot>
        </Grid>
      );
    case 9:
      return (
        <Grid value={value}>
          <Dot
            color={value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-1 row-start-2"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-3 row-start-2"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-2 row-start-1"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-2 row-start-3"
          ></Dot>
          <Dot
            color={value.color}
            className="col-start-2 row-start-2"
          ></Dot>
        </Grid>
      );
    default:
      return null;
  }
}

function Grid(props: {
  children: React.ReactNode;
  value: { value: number; color: Color; x?: number; y?: number };
  interactive?: boolean;
}) {
  return (
    <div className={cn("aspect-square bg-black rounded-lg",props.interactive ? "hover:bg-gray-800":"")}>
      <button
        value={JSON.stringify({ x: props.value.x, y: props.value.y })}
        name="position"
        type="submit"
        className="grid grid-cols-3 gap-1 p-1 grid-rows-3 w-full h-full"
        disabled={!props.interactive}
      >
        {props.children}
      </button>
    </div>
  );
}

function Dot({color,className}: { color: Color; className: string }) {
  return (
    <div
      className={cn(
        "aspect-square rounded-full",
        className,
        color === Color.RED ? "bg-red-400" : "",
        color === Color.GREEN ? "bg-green-400" : "",
        color === Color.BLUE ? "bg-blue-400" : "",
        color === Color.YELLOW ? "bg-yellow-400" : "",
        color === Color.WHITE ? "bg-white" : ""
      )}
    ></div>
  );
}
