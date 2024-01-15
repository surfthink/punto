import { getServerSession } from "next-auth";
import {
  getPlacedCards,
  getTurn,
  nextTurn,
  roomExists,
  savePlacedCard,
} from "../../room";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import {
  GameOverEvent,
  PlacedCardEvent,
  TurnChangedEvent,
} from "@/app/events/gameEvents";
import { RoomChannelName, pusher } from "@/app/api/pusher/pusher";
import { Card, Color } from "@/app/_shared/gameLogic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const roomId = params.id;
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({}, { status: 401, statusText: "Unauthorized" });
  }
  if (await !roomExists(roomId)) {
    return Response.json({}, { status: 404, statusText: "Not Found" });
  }

  const body = await request.json();
  const { x, y, card } = body;

  console.log(`placing card in room ${roomId}`);

  const currentPlayer = await getTurn(roomId);
  if (currentPlayer !== session.user.id) {
    console.log(`not ${session.user.id}'s turn`);
    console.log(`current player is ${currentPlayer}`);
    return Response.json(
      {},
      { status: 403, statusText: "Forbidden (Not your turn)" }
    );
  }

  if (!(await validPlacement(x, y, card, roomId))) {
    return Response.json(
      {},
      { status: 403, statusText: "Forbidden (Invalid placement)" }
    );
  }

  await savePlacedCard(roomId, {
    action: "CARD_PLACED",
    data: {
      card,
      x,
      y,
    },
  } as PlacedCardEvent);

  pusher.trigger(RoomChannelName(params.id), "GAME_EVENT", {
    action: "CARD_PLACED",
    data: {
      card,
      x,
      y,
    },
  } as PlacedCardEvent);

  const winner = await checkForWin(roomId, x, y, card.color);
  if (winner) {
    console.log("game over!");
    pusher.trigger(RoomChannelName(params.id), "GAME_EVENT", {
      action: "GAME_OVER",
      data: { winner: { id: session.user.id } },
    } as GameOverEvent);
  } else {
    await nextTurn(roomId);
    const nextPlayer = await getTurn(roomId);

    pusher.trigger(RoomChannelName(params.id), "GAME_EVENT", {
      action: "TURN_CHANGED",
      data: {
        turn: nextPlayer,
      },
    } as TurnChangedEvent);
  }

  return Response.json({}, { status: 200, statusText: "OK" });
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

function removeCoveredCards(
  cards: { x: number; y: number; c: Color; v: number }[]
) {
  const topCards: {
    [key: string]: { x: number; y: number; c: Color; v: number };
  } = {};
  cards.forEach((c) => {
    const key = `${c.x},${c.y}`;
    if (!topCards[key] || topCards[key].v < c.v) {
      topCards[key] = c;
    }
  });
  return Object.values(topCards);
}

async function validPlacement(
  x: number,
  y: number,
  card: Card,
  roomId: string
) {
  console.log("validating placement");
  const allCards = await getPlacedCards(roomId);
  const cards = removeCoveredCards(allCards);
  console.log(cards);
  if (
    cards.findIndex((c) => c.x === x && c.y === y && c.v >= card.value) !== -1
  ) {
    console.log("card already placed and it has a higher value");
    return false;
  }
  if (
    cards.findIndex((c) => c.x === x && c.y === y && c.c === card.color) !== -1
  ) {
    console.log("card already placed and it has the same color");
    return false;
  }
  return true;
}
