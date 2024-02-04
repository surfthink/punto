"use server";

import { PlayerInfo, getUserColor, roomExists, setUserColor } from "./room";
import { broadcastToRoom } from "../api/pusher/pusher";
import { db } from "../api/db/redis";
import { Color, RoomState } from "../_shared/gameLogic";
import { revalidatePath } from "next/cache";
import { drawCard, initDeck } from "./deck";

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

const COLORS = [Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW];

async function startGame(roomId: string, players: string[]) {
  await Promise.all([
    db.lpush(`room:${roomId}:order`, ...players),
    db.sadd(`room:${roomId}:players`, ...players),
    ...players.map((player, i) => setUserColor(roomId, player, COLORS[i])),
    ...players.map((player) => initDeck(roomId, player)),
    db.hset(`room:${roomId}`, { state: RoomState.PLAYING, turn: 0 }),
  ]);
  await Promise.all([...players.map((player) => drawCard(roomId, player))]);
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

export async function setWinner(roomId: string, username: string) {
  await db.hset(`room:${roomId}`, { winner: username });
}
export async function getWinner(roomId: string) {
  return (await db.hget(`room:${roomId}`, "winner")) as string | null;
}

export async function getRoomState(roomId: string) {
  return (await db.hget(`room:${roomId}`, "state")) as RoomState;
}

export async function nextTurn(roomId: string) {
  const turn = await db.hincrby(`room:${roomId}`, "turn", 1);
  return turn;
}

export async function getTurn(roomId: string) {
  const [turn, players] = await Promise.all([
    db.hget(`room:${roomId}`, "turn"),
    db.lrange(`room:${roomId}:order`, 0, -1),
  ]);
  return players[(turn as number) % players.length];
}
