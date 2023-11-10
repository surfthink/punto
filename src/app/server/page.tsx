"use client";

import { FormEventHandler, createRef, useState } from "react";
import RoomInfo from "../_components/RoomInfo";
import { useRoom } from "../_hooks/useRoom";

export default function Page() {
  const [room, setRoom] = useState<string>();
  const { players, id, color } = useRoom(room);

  const createRoom = async () => {
    console.log("create room");
    const res = await fetch(
      (process.env.NEXT_PUBLIC_BACKEND_URL as string) + "/create-room"
    );
    const body = await res.json();
    setRoom(body.roomId);
  };

  const roomInput = createRef<HTMLInputElement>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setRoom(roomInput.current?.value);
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
      {!!room && (
        <>
          <RoomInfo
            players={players}
            playerId={id}
            playerColor={color}
            roomId={room}
          ></RoomInfo>
          {/* <button onClick={startGame}>Start Game</button> */}
        </>
      )}
    </>
  );
}
