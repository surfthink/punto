"use server";
import { Color, RoomState } from "../_shared/gameLogic";
import { db } from "../api/db/redis";
import { drawCard, initDeck } from "./deck";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface PlayerInfo {
  color: Color;
  username: string;
}

export async function setUsernameCookie(username: string) {
  cookies().set("username", username);
}
export async function setRoomIdCookie(roomId: string) {
  cookies().set("roomId", roomId);
}

export async function getUsernameCookie() {
  if (!cookies().has("username")) {
    throw new Error("No username cookie found");
  }
  return cookies().get("username")?.value as string;
}
export async function getRoomIdCookie() {
  if (!cookies().has("roomId")) {
    throw new Error("No roomId cookie found");
  }
  return cookies().get("roomId")?.value as string;
}

export async function revalidateRoom(roomId: string) {
  revalidatePath(`/room/${roomId}`);
}

export async function setUsernameCookieRevalidateRoom(
  roomId: string,
  formData: FormData
) {
  cookies().set("username", formData.get("username") as string);
  revalidatePath("/room/" + roomId);
}

export async function getUsernameCookieOrUndefined() {
  return cookies().get("username")?.value as string | undefined;
}

export async function createRoom(formData: FormData) {
  const roomId = await randomUniqueCode(4);

  await setUsernameCookie(formData.get("username") as string);
  await db.hset(`room:${roomId}`, {
    state: RoomState.WAITING,
    turn: 0,
  });
  await db.expire(`room:${roomId}`, 60 * 60); // 1 hr

  redirect(`/room/${roomId}`);
}

export async function getColor(roomId: string) {
  const username = await getUsernameCookie();
  return (await db.get(`room:${roomId}:${username}`)) as Color;
}
export async function getUserColor(roomId: string, username: string) {
  return (await db.get(`room:${roomId}:${username}`)) as Color;
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
  }
  return code;
}
