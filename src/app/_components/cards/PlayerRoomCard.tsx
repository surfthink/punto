import { Color } from "@/app/_shared/gameLogic";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PersonIcon } from "@radix-ui/react-icons";
import PlacedCard from "../board/PlacedCard";

export default function PlayerRoomCard({
  color,
  username,
  player,
}: {
  color?: Color;
  username?: string;
  player?: string;
}) {
  if (!color || !username) return <Skeleton></Skeleton>;
  return (
    <Card
      className={cn(
        "flex justify-center h-full border-none drop-shadow-none shadow-none "
      )}
    >
      <CardHeader className="flex justify-center items-center">
        <div className="w-[50px] h-[50px]">
          <PlacedCard value={{ color, value: 3 }}></PlacedCard>
        </div>
        <CardTitle>
          {username == player ? `${username} (You)` : username}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
