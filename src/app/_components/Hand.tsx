import { Color } from "../_shared/gameLogic";
import PlacedCard from "./board/PlacedCard";
import { Skeleton } from "@/components/ui/skeleton";

interface HandProps {
  //needs to be told the card informationS
  color?: Color;
  value?: number;
}

export default function Hand({ color, value }: HandProps) {
  if (!color || !value) {
    return (
      <div className="flex items-center justify-center">
        <Skeleton className="w-[50px] aspect-square"></Skeleton>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-[50px]">
          <PlacedCard value={value} color={color}></PlacedCard>
        </div>
      </div>
    </>
  );
}
