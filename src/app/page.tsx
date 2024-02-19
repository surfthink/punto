import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import CreateRoomCard from "./_components/cards/CreateRoomCard";
import { JoinRoomCard } from "./_components/cards/JoinRoomCard";
import PuntoBanner from "./_components/PuntoBanner";
import { getUsernameCookie } from "./_actions/room";

export const metadata = {
  title: "Punto Online - Home",
  description: "Create or join a room to play Punto Online with friends.",
};

export default async function Home() {
  let username = ""
  try{
    username = await getUsernameCookie()
  } catch (e) { 
    username = ""
  }

  return (
    <main className="flex h-full flex-col items-center justify-center gap-16">
      <PuntoBanner className="text-5xl p-3" showOnline={true}/>
      <Tabs defaultValue="create" className="w-full px-2">
        <div className="w-full flex justify-center items-center">
        <TabsList className="flex justify-center w-fit self-center">
          <TabsTrigger value="create">Create Room</TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
        </TabsList>
        </div>
        <TabsContent value="create">
          <CreateRoomCard username={username} />
        </TabsContent>
        <TabsContent value="join">
          <JoinRoomCard />
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

function LocalGameCard() {
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
