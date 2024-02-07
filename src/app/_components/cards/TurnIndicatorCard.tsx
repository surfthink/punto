import { Color } from "@/app/_shared/gameLogic";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AvatarIcon } from "@radix-ui/react-icons";
import { PlayerInfo } from "@/app/_actions/room";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function TurnIndicatorCard({
  username,
  turn,
  player,
  index,
}: {
  username: string;
  turn: string;
  player?: PlayerInfo;
  index: number;
}) {
  if (!player) return <Skeleton></Skeleton>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          key={player.username}
          className={cn(
            "border border-white  border-8 rounded-lg z-10 w-full",
            player.color === Color.RED && turn === player.username
              ? "border-red-400"
              : "",
            player.color === Color.GREEN && turn === player.username
              ? "border-green-400"
              : "",
            player.color === Color.BLUE && turn === player.username
              ? "border-blue-400"
              : "",
            player.color === Color.YELLOW && turn === player.username
              ? "border-yellow-400"
              : "",
            index === 0 ? "col-start-1 row-start-1" : "",
            index === 1 ? "col-start-2 row-start-1" : "",
            index === 2 ? "col-start-1 row-start-2" : "",
            index === 3 ? "col-start-2 row-start-2" : ""
          )}
        >
          <div
            className={cn(
              "bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center p-1",
              turn === player.username ? "rounded-none" : ""
            )}
          >
            <AvatarIcon
              width={40}
              height={40}
              className={cn(
                player.color === Color.RED ? "text-red-400" : "",
                player.color === Color.GREEN ? "text-green-400" : "",
                player.color === Color.BLUE ? "text-blue-400" : "",
                player.color === Color.YELLOW ? "text-yellow-400" : ""
              )}
            ></AvatarIcon>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <p>{player.username}</p>
      </PopoverContent>
    </Popover>
  );
}
