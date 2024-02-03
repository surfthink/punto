import { Color } from "@/app/_shared/gameLogic";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PlacedCard from "../board/PlacedCard";
import { cn } from "@/lib/utils";
import { AvatarIcon, PersonIcon } from "@radix-ui/react-icons";

export default function TurnIndicatorCard({
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
    <Card className={cn("flex justify-center h-full rounded-none")}>
      <CardHeader className="flex justify-center items-center">
        <div className="max-w-[50px] max-h-[50px] w-full h-full aspect-square bg-black rounded-lg flex items-center justify-center">
          <AvatarIcon
            width={40}
            height={40}
            className={cn(
              color === Color.RED ? "text-red-400" : "",
              color === Color.GREEN ? "text-green-400" : "",
              color === Color.BLUE ? "text-blue-400" : "",
              color === Color.YELLOW ? "text-yellow-400" : ""
            )}
          ></AvatarIcon>
        </div>
        <CardTitle>{username}</CardTitle>
        <CardDescription>{username == player ? `(You)` : "--"}</CardDescription>
      </CardHeader>
    </Card>
  );
}
