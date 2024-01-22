import { createRoom } from "@/app/_actions/room";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateRoomCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Room</CardTitle>
        <CardDescription>Create a room to play with friends.</CardDescription>
      </CardHeader>
      <form action={createRoom} className="space-y-2">
        <CardContent className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input name="username" placeholder="Username" required></Input>
          <Label htmlFor="roomType">Privacy</Label>
          <Select name="roomType" defaultValue="public">
            <SelectTrigger>
              <SelectValue defaultValue="public"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              {/* <SelectItem value="private">Private</SelectItem> */}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
