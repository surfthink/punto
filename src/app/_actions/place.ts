"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import {
  GameOverEvent,
  PlacedCardEvent,
  TurnChangedEvent,
} from "../events/gameEvents";
import { RoomChannelName, pusher } from "../api/pusher/pusher";
import { Color } from "../_shared/gameLogic";
import { roomExists } from "./room";
import { db } from "../api/db/redis";
import { getTurn, nextTurn } from "./gameState";

export interface PlacedCard {
  x: number;
  y: number;
  c: Color;
  v: number;
}

export async function place(card: PlacedCard, roomId: string) {
  //error checks
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  const currentPlayer = await getTurn(roomId);
  if (currentPlayer !== session.user.id) {
    throw new Error("Forbidden (Not your turn)");
  }
  if (!(await validPlacement(card, roomId))) {
    throw new Error("Forbidden (Invalid placement)");
  }
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");

  await savePlacedCard(roomId, card);

  pusher.trigger(RoomChannelName(roomId), "GAME_EVENT", {
    action: "CARD_PLACED",
    data: {
      card: { color: card.c, value: card.v },
      x: card.x,
      y: card.y,
    },
  } as PlacedCardEvent);

  const winner = await checkForWin(roomId, card.x, card.y, card.c);
  if (winner) {
    console.log("game over!");
    pusher.trigger(RoomChannelName(roomId), "GAME_EVENT", {
      action: "GAME_OVER",
      data: { winner: { id: session.user.id } },
    } as GameOverEvent);
  } else {
    await nextTurn(roomId);
    const nextPlayer = await getTurn(roomId);

    pusher.trigger(RoomChannelName(roomId), "GAME_EVENT", {
      action: "TURN_CHANGED",
      data: {
        turn: nextPlayer,
      },
    } as TurnChangedEvent);
  }
}

async function checkForWin(roomId: string, x: number, y: number, color: Color) {
  const allCards = await getPlacedCards(roomId);
  const cards = removeCoveredCards(allCards);

  const relevantCards = cards.filter((c) => c.c === color);
  // check vertically from the placed card
  const verticalCards = relevantCards.filter((c) => c.x === x);
  console.log("vertical", verticalCards);
  if (
    verticalCards.length >= 4 &&
    hasFourConsecutive(verticalCards.map((c) => c.y))
  ) {
    return true;
  }
  // check horizontally from the placed card
  const horizontalCards = relevantCards.filter((c) => c.y === y);
  if (
    horizontalCards.length >= 4 &&
    hasFourConsecutive(horizontalCards.map((c) => c.x))
  ) {
    return true;
  }
  // check  negative diagonal from the placed card
  const negativeDiagonalCards = relevantCards.filter((c) => {
    const deltaX = x - c.x;
    const deltaY = y - c.y;

    if (deltaX === -deltaY) {
      return true;
    } else return false;
  });

  if (
    negativeDiagonalCards.length >= 4 &&
    hasFourConsecutive(negativeDiagonalCards.map((c) => c.x))
  ) {
    return true;
  }

  // check positive diagonal from the placed card
  const positiveDiagonalCards = relevantCards.filter((c) => {
    const deltaX = x - c.x;
    const deltaY = y - c.y;
    if (deltaX === deltaY) {
      //no abs values here because they have to be identical to get a positive product
      return true;
    } else return false;
  });
  if (
    positiveDiagonalCards.length >= 4 &&
    hasFourConsecutive(positiveDiagonalCards.map((c) => c.x))
  ) {
    return true;
  }
  return false;
}

function hasFourConsecutive(array: number[]): boolean {
  const sorted = array.toSorted((a, b) => a - b);
  console.log(sorted);
  for (let i = 0; i < sorted.length - 3; i++) {
    if (
      sorted[i] + 1 === sorted[i + 1] &&
      sorted[i] + 2 === sorted[i + 2] &&
      sorted[i] + 3 === sorted[i + 3]
    ) {
      return true;
    }
  }
  return false;
}

function removeCoveredCards(cards: PlacedCard[]) {
  const topCards: {
    [key: string]: PlacedCard;
  } = {};
  cards.forEach((c) => {
    const key = `${c.x},${c.y}`;
    if (!topCards[key] || topCards[key].v < c.v) {
      topCards[key] = c;
    }
  });
  return Object.values(topCards);
}

async function validPlacement(card: PlacedCard, roomId: string) {
  console.log("validating placement");
  const allCards = await getPlacedCards(roomId);
  const cards = removeCoveredCards(allCards);
  console.log(cards);
  if (
    cards.findIndex(
      (c) => c.x === card.x && c.y === card.y && c.v >= card.v
    ) !== -1
  ) {
    console.log("card already placed and it has a higher value");
    return false;
  }
  if (
    cards.findIndex(
      (c) => c.x === card.x && c.y === card.y && c.c === card.c
    ) !== -1
  ) {
    console.log("card already placed and it has the same color");
    return false;
  }
  return true;
}

export async function savePlacedCard(roomId: string, card: PlacedCard) {
  await db.rpush(`room:${roomId}:board`, JSON.stringify(card));
}

export async function getPlacedCards(roomId: string) {
  return (await db.lrange(`room:${roomId}:board`, 0, -1)) as PlacedCard[];
}

export async function getPlacedCardEvents(roomId: string) {
  const cards = await db.lrange(`room:${roomId}:board`, 0, -1);
  return cards.map((card) => {
    const tmp = JSON.parse(card) as PlacedCard;
    return {
      action: "CARD_PLACED",
      data: {
        x: tmp.x,
        y: tmp.y,
        card: {
          color: tmp.c,
          value: tmp.v,
        },
      },
    } as PlacedCardEvent;
  });
}
