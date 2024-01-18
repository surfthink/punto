"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { roomExists } from "./room";
import { RoomChannelName, pusher } from "../api/pusher/pusher";
import { NewGameEvent, TurnChangedEvent } from "../events/gameEvents";
import { db } from "../api/db/redis";
import { RoomState } from "../_shared/gameLogic";

export async function start(roomId: string) {
  const session = await getServerSession(authOptions);
  //check that user is in the room
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (await !roomExists(roomId)) {
    throw new Error("Room does not exist");
  }

  pusher.trigger(RoomChannelName(roomId), "GAME_EVENT", {
    action: "NEW_GAME",
    data: {},
  } as NewGameEvent);

  await startGame(roomId);
  const currentPlayer = await getTurn(roomId);

  pusher.trigger(RoomChannelName(roomId), "GAME_EVENT", {
    action: "TURN_CHANGED",
    data: {
      turn: currentPlayer,
    },
  } as TurnChangedEvent);
}

export async function startGame(roomId: string) {
  await db.hset(`room:${roomId}`, { state: RoomState.PLAYING });
}

export async function endGame(roomId: string) {
  await db.hset(`room:${roomId}`, { state: RoomState.FINISHED });
}

export async function getRoomState(roomId: string) {
  return (await db.hget(`room:${roomId}`, "state")) as RoomState;
}

export async function nextTurn(roomId: string) {
  const turn = await db.hincrby(`room:${roomId}`, "turn", 1);
  return turn;
}

export async function getTurn(roomId: string) {
  const turn = (await db.hget(`room:${roomId}`, "turn")) as number;
  //can i do this in one query?
  const players = await db.lrange(`room:${roomId}:order`, 0, -1);
  console.log(players);
  return players[turn % players.length];
}
