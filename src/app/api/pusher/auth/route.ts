import { GetRoomId, getTakenColors, pusher, userCountInRoom } from "../pusher";
import { cookies } from "next/headers";
import { getRoomState, playerInRoom } from "@/app/_actions/gameState";
import { setRoomIdCookie } from "@/app/_actions/room";

export async function POST(request: Request) {
  const form = await request.formData();
  const socketId = form.get("socket_id")! as string;
  const channel = form.get("channel_name")! as string;
  const roomId = GetRoomId(channel);

  if (!cookies().has("username")) {
    throw new Error("No username cookie found");
  }
  const username = cookies().get("username")?.value as string;

  const roomState = await getRoomState(roomId);
  switch (roomState) {
    case "WAITING":
      const userCount = await userCountInRoom(channel);
      console.log("user count", userCount);
      if (userCount >= 4) {
        throw new Error("Room is full");
      }
      setRoomIdCookie(roomId);
      return allowConnection(username, socketId, channel);

    case "PLAYING":
      if (!(await playerInRoom(roomId, username))) {
        throw new Error("cannot join the room. The game has started");
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
