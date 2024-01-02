"use client";
import Link from "next/link";
import { SessionProvider, useSession } from "next-auth/react";
import { LoginOrOut } from "./_components/authenticate/Authentication";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold underline">Punto Online</h1>
      <p>
        An online version of the European table top game. I was shown it by some
        dutch friends while traveling and decided it would be the perfect
        project to explore using web sockets with Next JS. Check out the actual{" "}
        <Link href="https://www.bernhardweber.de/punto.html">
          <b className="hover:underline">board game</b>
        </Link>{" "}
        by Bernhard Weber!
      </p>
      <br></br>
      <p>Play a local four player game:</p>
      <Link href="/game">
        <h2 className="text-xl font-bold hover:underline">Local Game</h2>
      </Link>
      <br></br>
      <p>Sign in to play a multiplayer version with up to 4 players:</p>
      <SessionProvider>
        <LoginOrOut></LoginOrOut>
        <CreateRoom></CreateRoom>
        <JoinRoom></JoinRoom>
      </SessionProvider>
    </main>
  );
}

function JoinRoom() {
  const router = useRouter();
  const { data: session } = useSession();
  const [roomCode, setRoomCode] = useState("");
  if (!session) return null;

  const handleJoin = () => {
    // redirect to room
    const path = "/room/" + roomCode;
    router.push(path);
  };

  return (
    <>
      <input
        type="text"
        className="text-black"
        placeholder="Room Code"
        onChange={(e) => setRoomCode(e.target.value)}
      ></input>
      <button onClick={handleJoin}>Join a room</button>
    </>
  );
}

function CreateRoom() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  const createRoom = async () => {
    const res = await fetch("api/room/create");
    if (!res.ok) {
      throw new Error("Could not create room");
    }
    const body = (await res.json()) as { id: string };
    // redirect to room
    const path = "/room/" + body.id;
    router.push(path);
  };
  return (
    <>
      <button onClick={createRoom}>Create a room</button>
    </>
  );
}
