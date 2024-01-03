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

export async function joinRoom(roomId: string, playerId: string) {
  if (!(await roomExists(roomId))) {
    throw new Error("Room does not exist");
  }
  const setLength = await db.scard(`room:${roomId}:players`);
  if (setLength >= 4) {
    throw new Error("Room is full");
  }

  const newEntry = !!(await db.sadd(`room:${roomId}:players`, playerId)); // returns 1 if new entry
  await db.expire(`room:${roomId}:players`, 60 * 60); // 1hr
  if (newEntry) {
    const event: PlayerJoinedEvent = {
      action: "PLAYER_JOINED",
      data: {
        player: {
          id: playerId,
          color: COLORS[setLength],
        },
      },
    };
    pusher.trigger(RoomChannelName(roomId), "GAME_EVENT", event);
  }
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
