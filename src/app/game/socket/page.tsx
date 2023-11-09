"use client";
import React from "react";
import { useEffect, useState } from "react";

export default function Page() {
  const [room, setRoom] = useState(null);
  const roomIdInput = React.createRef<HTMLInputElement>();

  useEffect(() => {
    (async () => {
      console.log("sending request to", process.env.NEXT_PUBLIC_BACKEND_URL);
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL as string);
      const body = await res.json();
      console.log(body);
    })();
  }, []);

  const makeRoom = () => {
    console.log("Making new room");
    const ws = new WebSocket(
      (process.env.NEXT_PUBLIC_WS_URL as string) + "/ws",
      "json"
    );
    console.log("**CREATEDWEBSOCKET");
    ws.onopen = (event) => {
      console.log("**ONOPEN");
    };
    ws.onmessage = (event) => {
      console.log("**ONMESSAGE");
      const body = JSON.parse(event.data);
      setRoom(body.roomId);
    };
  };

  const joinRoom = (roomId: string) => {
    console.log("joining room");

    const ws = new WebSocket(
      (process.env.NEXT_PUBLIC_WS_URL as string) + "/join",
      "json"
    );
    console.log("**CREATEDWEBSOCKET");

    ws.onopen = (event) => {
      console.log("**ONOPEN");
      ws.send(JSON.stringify({ roomId }));
    };

    ws.onmessage = (event) => {
      console.log("**ONMESSAGE");
      const body = JSON.parse(event.data);
      if (body.roomId) setRoom(body.roomId);
    };
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (roomIdInput.current) joinRoom(roomIdInput.current.value);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl">Testing room connection with backend</h1>
      <br></br>
      {!room && (
        <>
          <button className="border" onClick={makeRoom}>
            Create room
          </button>
          <p>or</p>
          <form onSubmit={handleSubmit}>
            <input
              className="text-black"
              name="roomId"
              placeholder="enter room id"
              type="text"
              ref={roomIdInput}
            ></input>
            <button className="border" type="submit">
              Join Room
            </button>
          </form>
        </>
      )}
      {!!room && (
        <p>
          Connected to <b>{room}</b>
        </p>
      )}
    </div>
  );
}
