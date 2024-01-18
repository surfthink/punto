"use server";

import { getServerSession } from "next-auth";
import { Color, RoomState } from "../_shared/gameLogic";
import { db } from "../api/db/redis";
import { initDeck } from "./deck";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

const COLORS = [Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW];

export async function createRoom() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  const roomId = await randomUniqueCode(4);

  console.log("creating room", roomId);
  await db.hset(`room:${roomId}`, {
    state: RoomState.WAITING,
    turn: 0,
  });
  await db.expire(`room:${roomId}`, 60 * 60); // 1 hr

  redirect(`/room/${roomId}`);
}

export async function joinRoom(roomId: string) {
  //throw errors if room does not exist etc.
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");

  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const numberInRoom = await db.scard(`room:${roomId}:players`);

  //add spectators
  if (numberInRoom < 4) {
    let success =
      (await db.sadd(`room:${roomId}:players`, session.user.id)) === 1;
    console.log("success", success);
    if (success) {
      await db.set(`room:${roomId}:${session.user.id}`, COLORS[numberInRoom]);
      await db.lpush(`room:${roomId}:order`, session.user.id);
      initDeck(roomId, session.user.id!);
    }
  }
  return true;
}
export async function getColor(roomId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return (await db.get(`room:${roomId}:${session.user.id}`)) as Color;
}

export async function getPlayerColors(roomId: string) {
  const playerColors: { id: string; color: Color }[] = [];
  const players = await db.smembers(`room:${roomId}:players`);
  for (const player of players) {
    const color = await db.get(`room:${roomId}:${player}`);
    playerColors.push({ id: player, color: color as Color });
  }
  return playerColors;
}

export async function roomExists(id: string): Promise<boolean> {
  const exists = await db.exists(`room:${id}`);
  return exists === 1;
}

export async function leaveRoom(roomId: string, userId: string) {
  await db.srem(`room:${roomId}:players`, userId);
  await db.del(`room:${roomId}:${userId}`);
}

function generateRandomCode(length: number): string {
  let code = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}

export async function randomUniqueCode(length: number) {
  let code = generateRandomCode(length);
  while (await roomExists(code)) {
    code = generateRandomCode(length);
    console.log(code);
  }
  return code;
}
