import { Color } from "@/app/_shared/gameLogic";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

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
        "flex justify-center h-full",
        color === Color.RED ? "bg-red-400" : "",
        color === Color.GREEN ? "bg-green-400" : "",
        color === Color.BLUE ? "bg-blue-400" : "",
        color === Color.YELLOW ? "bg-yellow-400" : ""
      )}
    >
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-center">
          {username == player ? `${username} (You)` : username}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
    </Card>
  );
}
