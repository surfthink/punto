"use server";
import { Color, RoomState } from "../_shared/gameLogic";
import { REDIS_GAME_KEY, db } from "../api/db/redis";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getOrderOfRoom } from "./gameState";
import { ValidationErrorCause } from "../api/pusher/auth/route";

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
    await validateUsername(username,roomId);
  } catch (e){
    console.error(e)
    return
  }

  await setUsernameCookie(username);
  await setRoomIdCookie(roomId);
  redirect(`/room/${roomId}`);
}

export async function createRoom(prevState:{success:boolean,message:string},formData: FormData) {
 try{
  await validateUsername(formData.get("username") as string);
 } catch (e){
   return {success:false,message:(e as Error).message}
 }
 
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

async function isUniqueInRoom(username:string,roomId:string){
  const players = await getOrderOfRoom(roomId)
  if(players.includes(username)) return false
  return true
}


export async function validateUsername(username:string,roomId?:string){
 if(!isAlphanumeric(username)) throw new Error("Username must include only alphanumeric characters.",{cause:ValidationErrorCause.ALPHANUMERIC});
 if(!roomId) return
 if(await !isUniqueInRoom(username,roomId)) throw new Error("Username is not unique in the room",{cause:ValidationErrorCause.NOT_UNIQUE} );
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
