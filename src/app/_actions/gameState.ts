"use server";

import { PlayerInfo, getUserColor, roomExists } from "./room";
import { broadcastToRoom } from "../api/pusher/pusher";
import { db } from "../api/db/redis";
import { RoomState } from "../_shared/gameLogic";
import { revalidatePath } from "next/cache";

export async function start(
  roomId: string,
  players: string[],
  formData: FormData
) {
  if (await !roomExists(roomId)) {
    throw new Error("Room does not exist");
  }

  await startGame(roomId, players);

  const currentPlayer = await getTurn(roomId);

  await broadcastToRoom(roomId, {
    action: "TURN_CHANGED",
  });

  revalidatePath(`/room/${roomId}`);
}

async function startGame(roomId: string, players: string[]) {
  await db.sadd(`room:${roomId}:players`, ...players);
  await db.hset(`room:${roomId}`, { state: RoomState.PLAYING });
}

export async function getPlayersInRoom(roomId: string) {
  return await db.smembers(`room:${roomId}:players`);
}

export async function getPlayerColors(roomId: string) {
  const players = await getPlayersInRoom(roomId);
  const colors: PlayerInfo[] = await Promise.all(
    players.map(async (player) => ({
      username: player,
      color: await getUserColor(roomId, player),
    }))
  );
  return colors;
}

export async function playerInRoom(roomId: string, username: string) {
  return (await db.sismember(`room:${roomId}:players`, username)) === 1;
}

export async function endGame(roomId: string) {
  await db.hset(`room:${roomId}`, { state: RoomState.FINISHED });
}

export async function getRoomState(roomId: string) {
  return (await db.hget(`room:${roomId}`, "state")) as RoomState;
}

export async function nextTurn(roomId: string) {
  const turn = await db.hincrby(`room:${roomId}`, "turn", 1);
  console.log("turn is now ", turn);
  return turn;
}

export async function getTurn(roomId: string) {
  const [turn, players] = await Promise.all([
    db.hget(`room:${roomId}`, "turn"),
    db.lrange(`room:${roomId}:order`, 0, -1),
  ]);
  return players[(turn as number) % players.length];
}
