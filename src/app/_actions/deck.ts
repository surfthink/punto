"use server";

import { Card } from "../_shared/gameLogic";
import { REDIS_GAME_KEY, db } from "../api/db/redis";
import {
  getColor,
  getRoomIdCookie,
  getUserColor,
  getUsernameCookie,
  roomExists,
} from "./room";

export async function drawCard(roomId?: string, username?: string) {
  if (!roomId) {
    roomId = await getRoomIdCookie();
  }
  if (!username) {
    username = await getUsernameCookie();
  }

  const card = (await db.spop(REDIS_GAME_KEY.deck(roomId, username))) as string;
  await db.set(REDIS_GAME_KEY.currentCard(roomId, username), card);
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

export async function getCurrentCard(roomId: string, username?: string) {
  if (!username) {
    username = await getUsernameCookie();
  }

  const [value, color] = await Promise.all([
    parseCard(await db.get(REDIS_GAME_KEY.currentCard(roomId, username))),
    getUserColor(roomId, username),
  ]);

  return { value, color } as Card;
}

const POSSIBLE_CARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export async function initDeck(roomId: string, username: string) {
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");
  POSSIBLE_CARD_VALUES.forEach((value) => {
    db.sadd(REDIS_GAME_KEY.deck(roomId, username), `${value}`);
    db.sadd(REDIS_GAME_KEY.deck(roomId, username), `${value}a`);
  });
}
