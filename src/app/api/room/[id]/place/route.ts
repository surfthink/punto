import { getServerSession } from "next-auth";
import { roomExists } from "../../room";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PlacedCardEvent, TurnChangedEvent } from "@/app/events/gameEvents";
import { RoomChannelName, pusher } from "@/app/api/pusher/pusher";

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
  pusher.trigger(RoomChannelName(params.id), "GAME_EVENT", {
    action: "CARD_PLACED",
    data: {
      card,
      x,
      y,
    },
  } as PlacedCardEvent);
  //   pusher.trigger(RoomChannelName(params.id), "GAME_EVENT", {} as TurnChangedEvent);
  return Response.json({}, { status: 200, statusText: "OK" });
}
