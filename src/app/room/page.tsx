import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Color } from "../_shared/gameLogic";

export default function Page() {
  // page only serves as a test for loading room players
  return (
    <Card>
      <CardHeader>
        <CardTitle>ROOM ID</CardTitle>
        <CardDescription>
          ...Waiting for players to join the room...
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 grid-cols-2 grid-rows-2">
        <PlayerRoomCard color={Color.RED} username="test (Me)"></PlayerRoomCard>
        <PlayerRoomCard color={Color.YELLOW} username="test2"></PlayerRoomCard>
        <PlayerRoomCard></PlayerRoomCard>
        <PlayerRoomCard></PlayerRoomCard>
      </CardContent>
      <CardFooter>
        <Button>Start Game</Button>
      </CardFooter>
    </Card>
  );
}

function PlayerRoomCard({
  color,
  username,
}: {
  color?: Color;
  username?: string;
}) {
  if (!color || !username)
    return (
      <Card className="flex justify-center">
        <CardHeader>
          <CardTitle>Invite Link</CardTitle>
        </CardHeader>
      </Card>
    );
  return (
    <Card
      className={cn(
        "flex justify-center",
        color === Color.RED ? "bg-red-400" : "",
        color === Color.GREEN ? "bg-green-400" : "",
        color === Color.BLUE ? "bg-blue-400" : "",
        color === Color.YELLOW ? "bg-yellow-400" : ""
      )}
    >
      <CardHeader>
        <CardTitle>{username}</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
    </Card>
  );
}
