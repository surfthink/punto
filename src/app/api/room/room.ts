import { db } from "../db/redis";

enum RoomState {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
}

export async function createRoom(id: string) {
  console.log("creating room ", id);
  await db.hset(`room:${id}`, { id, state: RoomState.WAITING });
  await db.expire(`room:${id}`, 60 * 60); // 1 hr
}

export async function joinRoom(roomId: string, playerId: string) {
  if (!(await roomExists(roomId))) {
    throw new Error("Room does not exist");
  }
  const setLength = await db.scard(`room:${roomId}:players`);
  if (setLength >= 4) {
    throw new Error("Room is full");
  }
  await db.sadd(`room:${roomId}:players`, playerId);
  await db.expire(`room:${roomId}:players`, 60 * 60); // 1hr
}

async function roomExists(id: string): Promise<boolean> {
  const exists = await db.hexists(`room:${id}`, "id");
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
    console.log(code);
  }
  return code;
}
