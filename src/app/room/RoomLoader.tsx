import { useState } from "react";
import {
  PlayerInfo,
  JoinedEvent,
  PlayerJoinedEvent,
  PuntoEvent,
  PlayerLeftEvent,
} from "../events/gameEvents";
import { useRoom } from "./useRoom";
import RoomInfo from "./RoomInfo";
import { Color } from "../_shared/gameLogic";

interface RoomLoaderProps {
  room: string;
}

export default function RoomLoader({ room }: RoomLoaderProps) {
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [color, setColor] = useState<Color>();

  const [playing, setPlaying] = useState(false);

  const handleMessage = (event: MessageEvent) => {
    console.log("**RECEIVE MESSAGE");
    const body = JSON.parse(event.data) as PuntoEvent<unknown>;
    console.log("server message: ", body);
    switch (body.action) {
      case "JOINED":
        const e = body as JoinedEvent;
        setPlayers(e.data.players);
        setColor(e.data.players.find((p) => p.id === e.data.playerId)?.color);
        break;
      case "PLAYER_JOINED":
        setPlayers([...players, (body as PlayerJoinedEvent).data.player]);
        break;
      case "PLAYER_LEFT":
        setPlayers([
          ...players.filter(
            (p) => p.id !== (body as PlayerLeftEvent).data.player.id
          ),
        ]);
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
