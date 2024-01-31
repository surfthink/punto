import { Color } from "@/app/_shared/gameLogic";
import { cn } from "@/lib/utils";

export default function PlacedCard(props: {
  value: { value: number; color: Color; x?: number; y?: number };
}) {
  switch (props.value.value) {
    case 1:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-2 row-start-2"
          ></Dot>
        </Grid>
      );
    case 2:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-3"
          ></Dot>
        </Grid>
      );
    case 3:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-2 row-start-2"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-3"
          ></Dot>
        </Grid>
      );
    case 4:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-3"
          ></Dot>
        </Grid>
      );
    case 5:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-2 row-start-2"
          ></Dot>
        </Grid>
      );
    case 6:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-2"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-2"
          ></Dot>
        </Grid>
      );
    case 7:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-2"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-2"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-2 row-start-2"
          ></Dot>
        </Grid>
      );
    case 8:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-2"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-2"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-2 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-2 row-start-3"
          ></Dot>
        </Grid>
      );
    case 9:
      return (
        <Grid value={props.value}>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-1 row-start-2"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-3 row-start-2"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-2 row-start-1"
          ></Dot>
          <Dot
            color={props.value.color}
            className="col-start-2 row-start-3"
          ></Dot>
          <Dot
            color={props.value.color}
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
}) {
  return (
    <div className={cn("aspect-square bg-black hover:bg-gray-800 rounded-lg")}>
      <button
        value={JSON.stringify({ x: props.value.x, y: props.value.y })}
        name="position"
        type="submit"
        className="grid grid-cols-3 gap-1 p-1 grid-rows-3 w-full h-full"
      >
        {props.children}
      </button>
    </div>
  );
}

function Dot(props: { color: Color; className: string }) {
  return (
    <div
      className={cn(
        "aspect-square rounded-full",
        props.className,
        props.color === Color.RED ? "bg-red-400" : "",
        props.color === Color.GREEN ? "bg-green-400" : "",
        props.color === Color.BLUE ? "bg-blue-400" : "",
        props.color === Color.YELLOW ? "bg-yellow-400" : ""
      )}
    ></div>
  );
}
