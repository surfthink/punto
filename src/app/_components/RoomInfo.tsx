"use client";
import { GeneralPlayerInfo } from "../_hooks/interfaces";

interface RoomInfoProps {
  playerId?: string;
  playerColor?: string;
  roomId?: string;
  players?: GeneralPlayerInfo[];
}

export default function RoomInfo({
  playerId,
  playerColor,
  roomId,
  players,
}: RoomInfoProps) {
  return (
    <>
      <p>room id: {roomId}</p>
      <p>id: {playerId}</p>
      <p>color: {playerColor}</p>
      {players &&
        players.map((p) => (
          <p key={p.id}>
            id:{p.id} color:{p.color}
          </p>
        ))}
    </>
  );
}
