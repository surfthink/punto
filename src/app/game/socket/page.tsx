"use client";
import { Color } from "@/app/_components/GameLogic";
import React from "react";
import { useEffect, useState } from "react";

interface PuntoEvent<T> {
  eventType: string;
  data: T;
}

interface GeneralPlayerInfo {
  color: Color;
  id: string;
}

interface PlayerJoinInfo {
  players: GeneralPlayerInfo[];
}
interface JoinedInfo {
  players: GeneralPlayerInfo[];
  playerId: string;
  roomId: string;
}

interface JoinedEvent extends PuntoEvent<JoinedInfo> {
  eventType: "JOINED";
}

interface PlayerJoinedEvent extends PuntoEvent<PlayerJoinInfo> {
  eventType: "PLAYER_JOINED";
}

interface PlayerLeftEvent extends PuntoEvent<PlayerJoinInfo> {
  eventType: "PLAYER_LEFT";
}

export default function Page() {
  const [room, setRoom] = useState<string>();
  const [players, setPlayers] = useState<GeneralPlayerInfo[]>();
  const [id, setId] = useState<string>();
  const [color, setColor] = useState<Color>();
  const roomIdInput = React.createRef<HTMLInputElement>();

  useEffect(() => {
    (async () => {
      console.log("sending request to", process.env.NEXT_PUBLIC_BACKEND_URL);
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL as string);
      const body = await res.json();
      console.log(body);
    })();
  }, []);

  const createRoom = async () => {
    console.log("Making new room");
    const res = await fetch(
      (process.env.NEXT_PUBLIC_BACKEND_URL as string) + "/create-room"
    );
    const body = await res.json();
    console.log(body);
    if (body.roomId) {
      joinRoom(body.roomId);
    }
  };

  const joinRoom = (roomId: string) => {
    console.log("trying to join room ", roomId);
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
      receiveMessage(event);
    };
  };

  const receiveMessage = (event: MessageEvent) => {
    console.log("**RECEIVEMESSAGE");
    const body = JSON.parse(event.data) as PuntoEvent<unknown>;
    console.log("server message: ", body);

    if (body.eventType === "JOINED") {
      const e = body as JoinedEvent;
      setRoom(e.data.roomId);
      setId(e.data.playerId);
      setPlayers(e.data.players);
      setColor(e.data.players.find((p) => p.id === id)?.color);
    }
    if (body.eventType === "PLAYER_JOINED") {
      setPlayers((body as PlayerJoinedEvent).data.players);
    }
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
          <button className="border" onClick={createRoom}>
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
      {!!id && <p>My id is: {id}</p>}
      {!!players && <p>Players in room</p>}
      {!!players &&
        players.map((p) => (
          <p key={p.id}>
            id: {p.id} color: {p.color}
          </p>
        ))}
    </div>
  );
}
