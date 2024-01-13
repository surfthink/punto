import { Color } from "@/app/_shared/gameLogic";
import { db } from "../db/redis";

enum RoomState {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
}

const COLORS = [Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW];

export async function createRoom(roomId: string) {
  console.log("creating room ", roomId);
  await db.hset(`room:${roomId}`, {
    id: roomId,
    state: RoomState.WAITING,
    turn: 0,
  });
  await db.expire(`room:${roomId}`, 60 * 60); // 1 hr
}

export async function joinRoom(roomId: string, userId: string) {
  const numberInRoom = await db.scard(`room:${roomId}:players`);
  if (numberInRoom < 4) {
    let success = (await db.sadd(`room:${roomId}:players`, userId)) === 1;
    console.log("success", success);
    if (success) {
      await db.set(`room:${roomId}:${userId}`, COLORS[numberInRoom]);
      await db.lpush(`room:${roomId}:order`, userId);
    }
  }
  return (await db.get(`room:${roomId}:${userId}`)) as Color;
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

export async function leaveRoom(roomId: string, userId: string) {
  await db.srem(`room:${roomId}:players`, userId);
  await db.del(`room:${roomId}:${userId}`);
}

export async function roomExists(id: string): Promise<boolean> {
  const exists = await db.hexists(`room:${id}`, "id");
  return exists === 1;
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
