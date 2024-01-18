import Link from "next/link";
import { LoginOrOut } from "./_components/authenticate/Authentication";
import { redirect } from "next/navigation";
import { createRoom } from "./_actions/room";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

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
      <LoginOrOut></LoginOrOut>
      <JoinRoom></JoinRoom>
      <CreateRoom></CreateRoom>
    </main>
  );
}

async function JoinRoom() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  async function joinRoom(formData: FormData) {
    "use server";
    redirect("/room/" + formData.get("roomId"));
  }

  return (
    <form action={joinRoom}>
      <input
        type="text"
        name="roomId"
        className="text-black"
        placeholder="Room Code"
      ></input>
      <button type="submit">Join a room</button>
    </form>
  );
}

async function CreateRoom() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return (
    <form action={createRoom}>
      <button type="submit">Create a room</button>
    </form>
  );
}
