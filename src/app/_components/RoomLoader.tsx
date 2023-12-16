import { useState } from "react";
import {
  GeneralPlayerInfo,
  JoinedEvent,
  PlayerJoinedEvent,
  PuntoEvent,
} from "../_hooks/interfaces";
import { useRoom } from "../_hooks/useRoom";
import RoomInfo from "./RoomInfo";
import { Color } from "../_hooks/GameLogic";
import Board from "./Board";

interface RoomLoaderProps {
  room: string;
}

export default function RoomLoader({ room }: RoomLoaderProps) {
  const [players, setPlayers] = useState<GeneralPlayerInfo[]>();
  const [color, setColor] = useState<Color>();

  const [playing, setPlaying] = useState(false);

  const handleMessage = (event: MessageEvent) => {
    console.log("**RECEIVEMESSAGE");
    const body = JSON.parse(event.data) as PuntoEvent<unknown>;
    console.log("server message: ", body);
    switch (body.eventType) {
      case "JOINED":
        const e = body as JoinedEvent;
        setPlayers(e.data.players);
        setColor(e.data.players.find((p) => p.id === e.data.playerId)?.color);
        break;
      case "PLAYER_JOINED":
        setPlayers((body as PlayerJoinedEvent).data.players);
        break;
      case "PLAYER_LEFT":
        setPlayers((body as PlayerJoinedEvent).data.players);
        break;
      case "START_GAME":
        console.log("GAME STARTED!");
        setPlaying(true);
        break;
    }
  };

  const { socket } = useRoom(room, handleMessage);

  return (
    <>
      <RoomInfo
        players={players}
        playerId={""}
        playerColor={color}
        roomId={room}
      ></RoomInfo>
      {!playing && (
        <button
          onClick={() =>
            socket?.send(JSON.stringify({ action: "START_GAME", data: {} }))
          }
        >
          Start Game
        </button>
      )}
      {playing && <p>The game has begun!</p>}
    </>
  );
}
