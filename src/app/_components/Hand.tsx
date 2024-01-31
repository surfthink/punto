import { Card, Color } from "../_shared/gameLogic";
import PlacedCard from "./board/PlacedCard";
import { Skeleton } from "@/components/ui/skeleton";

interface HandProps {
  //needs to be told the card informationS
  card?: Card;
}

export default function Hand({ card }: HandProps) {
  if (!card) {
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
          <PlacedCard value={{ ...card }}></PlacedCard>
        </div>
      </div>
    </>
  );
}
