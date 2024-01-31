"use server";
import { Color, RoomState } from "../_shared/gameLogic";
import { db } from "../api/db/redis";
import { drawCard, initDeck } from "./deck";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { PuntoEvent } from "../events/gameEvents";

const COLORS = [Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW];

export async function joinPrivateRoom(formData: FormData) {
  "use server";
  const username = formData.get("username");
  const roomId = formData.get("roomId");
  await setUsernameCookie(username as string);
  redirect("/room/" + roomId);
}

export async function setUsernameCookie(username: string) {
  cookies().set("username", username);
}
export async function setRoomIdCookie(roomId: string) {
  cookies().set("roomId", roomId);
}

export async function revalidateRoom(roomId: string) {
  console.log("revalidating room ", roomId);
  revalidatePath(`/room/${roomId}`);
}

export async function setUsernameCookieRevalidateRoom(
  roomId: string,
  formData: FormData
) {
  cookies().set("username", formData.get("username") as string);
  revalidatePath("/room/" + roomId);
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

export async function getUsernameCookieOrUndefined() {
  return cookies().get("username")?.value as string | undefined;
}

export async function createRoom(formData: FormData) {
  const roomId = await randomUniqueCode(4);

  await setUsernameCookie(formData.get("username") as string);

  console.log("creating room", roomId);
  await db.hset(`room:${roomId}`, {
    state: RoomState.WAITING,
    turn: 0,
  });
  await db.expire(`room:${roomId}`, 60 * 60); // 1 hr

  redirect(`/room/${roomId}`);
}

export async function joinRoomDummy(roomId: string) {
  console.log("joining room", roomId);
}

export async function joinRoom(roomId: string, takenColors: Color[]) {
  //throw errors if room does not exist etc.
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");

  const username = await getUsernameCookie();

  //TODO:add spectators
  if (takenColors.length < 4) {
    setRoomIdCookie(roomId);
    const availableColors = COLORS.filter((c) => !takenColors.includes(c));
    console.log("availableColors", availableColors);
    await db.set(`room:${roomId}:${username}`, availableColors[0]);
    await db.lpush(`room:${roomId}:order`, username);
    await initDeck(roomId, username);
    await drawCard();
  }
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
    console.log(code);
  }
  return code;
}

export async function saveEventToRoom(
  roomId: string,
  event: PuntoEvent<unknown>
) {
  await db.rpush(`room:${roomId}:events`, JSON.stringify(event));
}

export async function getEvents(roomId: string) {
  const events = await db.lrange(`room:${roomId}:events`, 0, -1);
  return events as unknown as PuntoEvent<unknown>[];
}
