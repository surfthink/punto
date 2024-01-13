import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Session, getServerSession } from "next-auth";
import { getTurn, roomExists } from "../../room";
import { RoomChannelName, pusher } from "@/app/api/pusher/pusher";
import { NewGameEvent, TurnChangedEvent } from "@/app/events/gameEvents";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const roomId = params.id;
  const session = await getServerSession(authOptions);
  //check that user is in the room
  if (!session) {
    return Response.json({}, { status: 401, statusText: "Unauthorized" });
  }
  if (await !roomExists(roomId)) {
    return Response.json({}, { status: 404, statusText: "Not Found" });
  }
  const event: NewGameEvent = {
    action: "NEW_GAME",
  };
  pusher.trigger(RoomChannelName(params.id), "GAME_EVENT", event);
  const currentPlayer = await getTurn(roomId);

  pusher.trigger(RoomChannelName(params.id), "GAME_EVENT", {
    action: "TURN_CHANGED",
    data: {
      turn: currentPlayer,
    },
  } as TurnChangedEvent);

  return Response.json({}, { status: 200, statusText: "OK" });
}
