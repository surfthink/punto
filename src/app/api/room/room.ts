import { PlayerJoinedEvent } from "@/app/events/gameEvents";
import { db } from "../db/redis";
import { RoomChannelName, pusher } from "../pusher/pusher";
import { Color } from "@/app/_shared/gameLogic";

enum RoomState {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
}

const COLORS: Color[] = [Color.BLUE, Color.GREEN, Color.RED, Color.YELLOW];

export async function createRoom(id: string) {
  console.log("creating room ", id);
  await db.hset(`room:${id}`, { id, state: RoomState.WAITING });
  await db.expire(`room:${id}`, 60 * 60); // 1 hr
}

export async function roomExists(id: string): Promise<boolean> {
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
