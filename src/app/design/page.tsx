import { cn } from "@/lib/utils";
import { Card, Color } from "../_shared/gameLogic";

export default function Page() {
  return (
    <>
      <h1>Design Sandbox</h1>
      <div className="w-[90px]">
        <PlacedCard color={Color.RED} value={1}></PlacedCard>
      </div>
      <div className="w-[90px]">
        <PlacedCard color={Color.BLUE} value={2}></PlacedCard>
      </div>
      <div className="w-[90px]">
        <PlacedCard color={Color.YELLOW} value={3}></PlacedCard>
      </div>
      <div className="w-[90px]">
        <PlacedCard color={Color.GREEN} value={4}></PlacedCard>
      </div>
      <div className="w-[90px]">
        <PlacedCard color={Color.RED} value={5}></PlacedCard>
      </div>
      <div className="w-[90px]">
        <PlacedCard color={Color.RED} value={6}></PlacedCard>
      </div>
      <div className="w-[90px]">
        <PlacedCard color={Color.RED} value={7}></PlacedCard>
      </div>
      <div className="w-[90px]">
        <PlacedCard color={Color.RED} value={8}></PlacedCard>
      </div>
      <div className="w-[90px]">
        <PlacedCard color={Color.RED} value={9}></PlacedCard>
      </div>
    </>
  );
}

function PlacedCard(props: Card) {
  switch (props.value) {
    case 1:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-2 row-start-2"></Dot>
        </Grid>
      );
    case 2:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-1 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-3"></Dot>
        </Grid>
      );
    case 3:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-1 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-2 row-start-2"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-3"></Dot>
        </Grid>
      );
    case 4:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-1 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-3"></Dot>
        </Grid>
      );
    case 5:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-1 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-2 row-start-2"></Dot>
        </Grid>
      );
    case 6:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-1 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-2"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-2"></Dot>
        </Grid>
      );
    case 7:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-1 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-2"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-2"></Dot>
          <Dot color={props.color} className="col-start-2 row-start-2"></Dot>
        </Grid>
      );
    case 8:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-1 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-2"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-2"></Dot>
          <Dot color={props.color} className="col-start-2 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-2 row-start-3"></Dot>
        </Grid>
      );
    case 9:
      return (
        <Grid>
          <Dot color={props.color} className="col-start-1 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-1 row-start-2"></Dot>
          <Dot color={props.color} className="col-start-3 row-start-2"></Dot>
          <Dot color={props.color} className="col-start-2 row-start-1"></Dot>
          <Dot color={props.color} className="col-start-2 row-start-3"></Dot>
          <Dot color={props.color} className="col-start-2 row-start-2"></Dot>
        </Grid>
      );
    default:
      return null;
  }
}

function Grid(props: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "aspect-square bg-black hover:bg-gray-800 grid grid-cols-3 gap-1 p-1 grid-rows-3 rounded-lg border-white border"
      )}
    >
      {props.children}
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
