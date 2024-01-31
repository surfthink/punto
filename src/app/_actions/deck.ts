"use server";

import { Card } from "../_shared/gameLogic";
import { db } from "../api/db/redis";
import {
  getColor,
  getRoomIdCookie,
  getUserColor,
  getUsernameCookie,
  roomExists,
} from "./room";

const POSSIBLE_CARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export async function drawCard() {
  const roomId = await getRoomIdCookie();
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  const username = await getUsernameCookie();

  const card = (await db.spop(`room:${roomId}:deck:${username}`)) as string;
  await db.set(`room:${roomId}:currentCard:${username}`, card);
  console.log("drew card from redis ", card);
  return parseCard(card);
}

function parseCard(card: string | null) {
  if (card === null) {
    throw new Error("Card is null");
  }
  if (String(card).length === 1) {
    return Number(card);
  }
  return Number(card[0]);
}

export async function getCurrentCard(roomId: string) {
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  const username = await getUsernameCookie();
  const card = {
    value: parseCard(await db.get(`room:${roomId}:currentCard:${username}`)),
    color: await getUserColor(roomId, username),
  };
  return card;
}

export async function initDeck(roomId: string, userId: string) {
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  POSSIBLE_CARD_VALUES.forEach((value) => {
    db.sadd(`room:${roomId}:deck:${userId}`, `${value}`);
    db.sadd(`room:${roomId}:deck:${userId}`, `${value}a`);
  });
}
