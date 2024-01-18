"use server";

import { db } from "../api/db/redis";
import { roomExists } from "../api/room/room";

const POSSIBLE_CARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export async function drawCard(roomId: string, userId: string) {
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  const card = (await db.spop(`room:${roomId}:deck:${userId}`)) as string;
  console.log("drew card from redis ", card);
  if (String(card).length === 1) {
    return Number(card);
  }
  return Number(card[0]);
}

export async function initDeck(roomId: string, userId: string) {
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  POSSIBLE_CARD_VALUES.forEach((value) => {
    db.sadd(`room:${roomId}:deck:${userId}`, `${value}`);
    db.sadd(`room:${roomId}:deck:${userId}`, `${value}a`);
  });
}
