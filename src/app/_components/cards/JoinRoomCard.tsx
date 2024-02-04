import { getUsernameCookie, joinRoom } from "@/app/_actions/room";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export async function JoinRoomCard() {
  let username: string;
  try {
    username = await getUsernameCookie();
  } catch (e) {
    username = "";
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Room</CardTitle>
        <CardDescription>
          Join a game room your friend has created.
        </CardDescription>
      </CardHeader>
      <form className="space-y-2" action={joinRoom}>
        <CardContent className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input name="username" required defaultValue={username}></Input>
          <Label htmlFor="roomId">Room Code</Label>
          <Input name="roomId" required placeholder="Room Code"></Input>
        </CardContent>
        <CardFooter>
          <Button type="submit">Join</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
