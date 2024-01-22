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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function JoinPublicRoomCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Public Room</CardTitle>
        <CardDescription>
          <b>
            **This feature is not available yet and serves as a placeholder.**
          </b>
        </CardDescription>
        <CardDescription>
          Join a public room with other players.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input name="username" placeholder="Jago"></Input>
        </form>
        <Table>
          <TableCaption>A list of public rooms.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Room Id</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Players</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">T1sT</TableCell>
              <TableCell>Playing</TableCell>
              <TableCell>4</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button>Join</Button>
      </CardFooter>
    </Card>
  );
}
