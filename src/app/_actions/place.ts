"use server";

import {
  GetRoomId,
  RoomChannelName,
  broadcastToRoom,
  pusher,
} from "../api/pusher/pusher";
import {
  Color,
  PlaceDetails,
  canBeOpened,
  closeInvalidOpenPlaces,
} from "../_shared/gameLogic";
import { getRoomIdCookie, getUsernameCookie, roomExists } from "./room";
import { db } from "../api/db/redis";
import { endGame, getTurn, nextTurn } from "./gameState";
import { drawCard, getCurrentCard } from "./deck";

export interface PlacedCard {
  x: number;
  y: number;
  c: Color;
  v: number;
}

export async function place(x: number, y: number) {
  //error checks
  console.log("placing at ", x, y);
  const username = await getUsernameCookie();
  const roomId = await getRoomIdCookie();

  const currentPlayer = await getTurn(roomId);
  if (currentPlayer !== username) {
    throw new Error("Forbidden (Not your turn)");
  }
  const card = await getCurrentCard(roomId);
  const placedCard = { x, y, c: card.color, v: card.value };
  if (!(await validPlacement(placedCard, roomId))) {
    throw new Error("Forbidden (Invalid placement)");
  }
  if (!(await roomExists(roomId))) throw new Error("Room does not exist");

  await savePlacedCard(roomId, placedCard);

  await nextTurn(roomId);
  const nextPlayer = await getTurn(roomId);
  await drawCard();
  broadcastToRoom(roomId, { action: "TURN_CHANGED" });

  const winner = await checkForWin(roomId, x, y, card.color);
  if (winner) {
    console.log("game over!");
    broadcastToRoom(roomId, { action: "GAME_OVER" });
    await endGame(roomId);
  }
}

async function checkForWin(roomId: string, x: number, y: number, color: Color) {
  console.log("checking for win");
  const allCards = await getPlacedCards(roomId);
  const cards = removeCoveredCards(allCards);
  const relevantCards = cards.filter((c) => c.c === color);
  // check vertically from the placed card
  const verticalCards = relevantCards.filter((c) => c.x === x);
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
  const sorted = [...array].sort((a, b) => a - b);
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
  const allCards = await getPlacedCards(roomId);
  const cards = removeCoveredCards(allCards);
  if (
    cards.findIndex(
      (c) => c.x === card.x && c.y === card.y && c.v >= card.v
    ) !== -1
  ) {
    return false;
  }
  if (
    cards.findIndex(
      (c) => c.x === card.x && c.y === card.y && c.c === card.c
    ) !== -1
  ) {
    return false;
  }
  return true;
}

function newBoard(size: number) {
  const board: PlaceDetails[][] = [];
  for (let i = 0; i < size; i++) {
    board.push([]);
    for (let j = 0; j < size; j++) {
      board[i][j] = { state: "closed" };
    }
  }
  board[Math.floor(size / 2)][Math.floor(size / 2)].state = "open";
  return board;
}

export async function getBoard(roomId: string) {
  const allPlacedCards = await getPlacedCards(roomId);
  const cards = removeCoveredCards(allPlacedCards);
  const board = newBoard(11);
  cards.forEach((card) => {
    board[card.y][card.x].card = { color: card.c, value: card.v };
    board[card.y][card.x].state = "open";
    openAdjacentPlaces(board, card.x, card.y);
  });
  closeInvalidOpenPlaces(board);
  return board;
}

function openAdjacentPlaces(board: PlaceDetails[][], x: number, y: number) {
  for (let j = y - 1; j < y + 2; j++) {
    for (let i = x - 1; i < x + 2; i++) {
      if (canBeOpened(board, i, j)) {
        board[j][i].state = "open";
      }
    }
  }
}

export async function savePlacedCard(roomId: string, card: PlacedCard) {
  await db.rpush(`room:${roomId}:board`, JSON.stringify(card));
}

export async function getPlacedCards(roomId: string) {
  return (await db.lrange(`room:${roomId}:board`, 0, -1)) as PlacedCard[];
}
