import { GetRoomId, pusher, userCountInRoom } from "../pusher";
import { cookies } from "next/headers";
import { getRoomState, playerInRoom } from "@/app/_actions/gameState";
import { setRoomIdCookie, validateUsername } from "@/app/_actions/room";

export async function POST(request: Request) {
  const form = await request.formData();
  const socketId = form.get("socket_id")! as string;
  const channel = form.get("channel_name")! as string;
  const roomId = GetRoomId(channel);


  if (!cookies().has("username")) {
    return rejectDueToNoUsername(channel, socketId);
  }
  const username = cookies().get("username")?.value as string;

  const roomState = await getRoomState(roomId);

  try{
  await validateUsername(username, roomId);
  } catch (e){
    return rejectDueToValidationError(channel, socketId, e as Error);
  }

  switch (roomState) {
    case "WAITING":
      const userCount = await userCountInRoom(channel);
      if (userCount >= 4) {
        return rejectDueToFullRoom(channel, socketId)
      }
      setRoomIdCookie(roomId);
      return allowConnection(username, socketId, channel);

    case "PLAYING":
      if (!(await playerInRoom(roomId, username))) {
        return rejectDueToPlayerNotInRoom(channel, socketId);
      }
      return allowConnection(username, socketId, channel);

    case "FINISHED":
      throw new Error("joining after game is finished");
    default:
      throw new Error("room does not exist");
  }
}

function allowConnection(username: string, socketId: string, channel: string) {
  const presenceData = {
    user_id: username,
    user_info: {
      username,
    },
  };
  // This authenticates every user. Don't do this in production!
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  return Response.json(authResponse);
}

function rejectDueToNoUsername(channel: string, socketId: string) {
  const res = new Response("Unauthorized", { status: 401 });
  return res
}

function rejectDueToFullRoom(channel: string, socketId: string) {
  const res = new Response("Unauthorized", { status: 403 });
  return res
}

function rejectDueToValidationError(channel: string, socketId: string, e: Error) {
  const res = new Response("Unauthorized", { status: 403 });
  return res
}

function rejectDueToPlayerNotInRoom(channel: string, socketId: string) {
  const res = new Response("Unauthorized", { status: 403 });
  return res
}

export enum ValidationErrorCause {
  ALPHANUMERIC = "Username not alphanumeric",
  NOT_UNIQUE = "Username must be unique in room"
}