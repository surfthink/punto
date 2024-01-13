import { getServerSession } from "next-auth";
import {
  getPlacedCards,
  getTurn,
  nextTurn,
  roomExists,
  savePlacedCard,
} from "../../room";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PlacedCardEvent, TurnChangedEvent } from "@/app/events/gameEvents";
import { RoomChannelName, pusher } from "@/app/api/pusher/pusher";
import { Card } from "@/app/_shared/gameLogic";

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

  await nextTurn(roomId);
  const nextPlayer = await getTurn(roomId);

  pusher.trigger(RoomChannelName(params.id), "GAME_EVENT", {
    action: "TURN_CHANGED",
    data: {
      turn: nextPlayer,
    },
  } as TurnChangedEvent);

  return Response.json({}, { status: 200, statusText: "OK" });
}

async function validPlacement(
  x: number,
  y: number,
  card: Card,
  roomId: string
) {
  //TODO
  console.log("validating placement");
  const cards = await getPlacedCards(roomId);
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
