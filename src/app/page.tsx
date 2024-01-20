"use client";
import { redirect } from "next/navigation";
import { createRoom } from "./_actions/room";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [gameMode, setGameMode] = useState<"online" | "local">("online");
  const handleGameModeChange = (value: string) => {
    setGameMode(value as "online" | "local");
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-6">
      <div className="flex gap-2 text-3xl">
        {gameMode === "online" && (
          <>
            <Button onClick={createRoom}>Create room</Button>
            <div> or </div>
            <Button>Play in room</Button>
            <Input></Input>
          </>
        )}
        {gameMode === "local" && <Button>Play</Button>}
      </div>
      <SelectGameMode onValueChange={handleGameModeChange}></SelectGameMode>
    </main>
  );
}

// async function JoinRoom() {
//   const session = await getServerSession(authOptions);
//   if (!session) return null;

//   async function joinRoom(formData: FormData) {
//     "use server";
//     redirect("/room/" + formData.get("roomId"));
//   }

//   return (
//     <form action={joinRoom}>
//       <input
//         type="text"
//         name="roomId"
//         className="text-black"
//         placeholder="Room Code"
//       ></input>
//       <button type="submit">Join a room</button>
//     </form>
//   );
// }

// async function CreateRoom() {
//   const session = await getServerSession(authOptions);
//   if (!session) return null;
//   return (
//     <form action={createRoom}>
//       <button type="submit">Create a room</button>
//     </form>
//   );
// }

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
