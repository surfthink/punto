"use client";
import { useRouter } from "next/navigation";
import { FormEventHandler, createRef, useEffect, useState } from "react";
export default function Page() {
  const [room, setRoom] = useState<string>();
  const router = useRouter();

  const createRoom = async () => {
    console.log("create room");
    const res = await fetch(
      (process.env.NEXT_PUBLIC_BACKEND_URL as string) + "/create-room",
      {
        credentials: "include",
        mode: "cors",
      }
    );
    const body = await res.json();
    console.log("going to created room: ", body.room);
    router.push(`/room/${body.room}`);
  };

  const roomInput = createRef<HTMLInputElement>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    router.push(`/room/${roomInput.current?.value}`);
  };

  return (
    <>
      <button onClick={createRoom}>Create room</button>
      <form onSubmit={handleSubmit}>
        <input
          name="roomId"
          ref={roomInput}
          type="text"
          className="text-black"
        ></input>
        <button type="submit">Join Room</button>
      </form>
    </>
  );
}
