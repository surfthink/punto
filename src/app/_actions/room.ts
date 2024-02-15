"use server";
import { Color, RoomState } from "../_shared/gameLogic";
import { REDIS_GAME_KEY, db } from "../api/db/redis";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface PlayerInfo {
  color: Color;
  username: string;
}

export async function expireGameKeys(roomId: string) {
  const keys = await db.keys(`room:${roomId}:*`);
  await Promise.all(keys.map((key) => db.expire(key, 60 * 60)));
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

export async function joinRoom(formData: FormData) {
  const roomId = formData.get("roomId") as string;
  const username = formData.get("username") as string;

  try {
    await validateUsername(username);
  } catch (e){
    console.error(e)
    return
  }

  await setUsernameCookie(username);
  await setRoomIdCookie(roomId);
  redirect(`/room/${roomId}`);
}

export async function createRoom(formData: FormData) {
  const roomId = await randomUniqueCode(4);


  await setUsernameCookie(formData.get("username") as string);
  await db.hset(REDIS_GAME_KEY.stateObject(roomId), {
    state: RoomState.WAITING,
  });

  redirect(`/room/${roomId}`);
}

function isAlphanumeric(s: string): boolean {
  const regex = /^[a-z0-9]+$/i;
  return regex.test(s);
}

function isUniqueInRoom(username:string){
  //TODO
  return true
}

async function validateUsername(username:string){
 if(!isAlphanumeric(username)) throw new Error("Username must be alphanumeric");
  if(await !isUniqueInRoom(username)) throw new Error("Username must be unique in room");
 return
}

export async function getColor(roomId: string) {
  const username = await getUsernameCookie();
  return (await db.get(REDIS_GAME_KEY.playerColor(roomId, username))) as Color;
}
export async function getUserColor(roomId: string, username: string) {
  return (await db.get(REDIS_GAME_KEY.playerColor(roomId, username))) as Color;
}
export async function setUserColor(
  roomId: string,
  username: string,
  color: Color
) {
  await db.set(REDIS_GAME_KEY.playerColor(roomId, username), color);
  return;
}

export async function roomExists(roomId: string) {
  const exists = await db.exists(REDIS_GAME_KEY.stateObject(roomId));
  return exists === 1;
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
