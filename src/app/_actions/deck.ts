"use server";

import { db } from "../api/db/redis";
import { getUsernameCookie, roomExists } from "./room";

const POSSIBLE_CARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export async function drawCard(roomId: string) {
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  const username = await getUsernameCookie();

  const card = (await db.spop(`room:${roomId}:deck:${username}`)) as string;
  await db.set(`room:${roomId}:currentCard:${username}`, card);
  console.log("drew card from redis ", card);
  return parseCard(card);
}

function parseCard(card: string) {
  if (String(card).length === 1) {
    return Number(card);
  }
  return Number(card[0]);
}

export async function getCurrentCard(roomId: string) {
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  const username = await getUsernameCookie();
  const card = (await db.get(
    `room:${roomId}:currentCard:${username}`
  )) as string;
  return parseCard(card);
}

export async function initDeck(roomId: string, userId: string) {
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  POSSIBLE_CARD_VALUES.forEach((value) => {
    db.sadd(`room:${roomId}:deck:${userId}`, `${value}`);
    db.sadd(`room:${roomId}:deck:${userId}`, `${value}a`);
  });
}
