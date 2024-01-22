"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import CreateRoomCard from "./_components/cards/CreateRoomCard";
import { JoinRoomCard } from "./_components/cards/JoinRoomCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-6">
      <p className="mt-6 md:w-2/3">
        This website is still in development. Many features are not implemented
        yet. Rooms do not currently have a privacy level.
      </p>
      <Tabs defaultValue="create">
        <TabsList className="flex justify-center">
          <TabsTrigger value="create">Create Room</TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
          {/* <TabsTrigger value="public">Join Public</TabsTrigger> */}
          <TabsTrigger value="local">Local</TabsTrigger>
        </TabsList>
        <TabsContent value="local">
          <LocalGameCard />
        </TabsContent>
        <TabsContent value="create">
          <CreateRoomCard />
        </TabsContent>
        <TabsContent value="join">
          <JoinRoomCard />
        </TabsContent>
        <TabsContent value="public">
          <JoinPublicRoomCard />
        </TabsContent>
      </Tabs>
    </main>
  );
}

interface SelectGameModeProps {
  onValueChange?: (value: string) => void;
}
function SelectGameMode({ onValueChange }: SelectGameModeProps) {
  return (
    <div className="flex items-center gap-3">
      <div>Gamemode: </div>
      <Select defaultValue="online" onValueChange={onValueChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Online"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="local">Local</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

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

export function LocalGameCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Game</CardTitle>
        <CardDescription>
          Start a local game within this browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form className="space-y-1">
          <Label htmlFor="name">Number of players</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="2"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </CardContent>
      <CardFooter>
        <Button>Start Game</Button>
      </CardFooter>
    </Card>
  );
}
