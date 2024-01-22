import { getServerSession } from "next-auth";
import { GetRoomId, RoomChannelName, pusher } from "../pusher";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { cookies } from "next/headers";
import { getColor, getUserColor, joinRoom } from "@/app/_actions/room";
import { PresenceChannelData } from "pusher";
import { Color } from "@/app/_shared/gameLogic";

export async function POST(request: Request) {
  const form = await request.formData();
  const socketId = form.get("socket_id")! as string;
  const channel = form.get("channel_name")! as string;
  const roomId = GetRoomId(channel);

  if (!cookies().has("username")) {
    throw new Error("No username cookie found");
  }
  const username = cookies().get("username")?.value as string;

  const takenColors = await getTakenColors(channel);
  if (!takenColors) throw new Error("Error getting taken colors");
  if (takenColors.length >= 4) {
    throw new Error("Room is full");
  }

  console.log(takenColors);
  await joinRoom(roomId, takenColors);

  const color = await getColor(roomId);

  const presenceData = {
    user_id: username,
    user_info: {
      username,
      color,
    },
  };
  // This authenticates every user. Don't do this in production!
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  return Response.json(authResponse);
}

async function numberOfUsersInRoom(channelName: string) {
  const res = await pusher.get({
    path: "/channels/" + channelName + "/users",
  });
  if (res.status !== 200) {
    throw new Error("Error getting pusher users");
  }
  if (res.status === 200) {
    const body = await res.json();
    const users = body.users;
    return users.length;
  }
}
async function getTakenColors(channelName: string) {
  const res = await pusher.get({
    path: "/channels/" + channelName + "/users",
  });
  if (res.status !== 200) {
    throw new Error("Error getting pusher users");
  }
  if (res.status === 200) {
    const body = await res.json();
    const ids = body.users.map((u: any) => u.id);
    const colors: Color[] = [];
    for (let id of ids) {
      colors.push(await getUserColor(GetRoomId(channelName), id));
    }

    return colors;
  }
}
