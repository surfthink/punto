import { getUserColor, revalidateRoom } from "@/app/_actions/room";
import { Color } from "@/app/_shared/gameLogic";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import Pusher from "pusher";

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export function RoomChannelName(roomId: string) {
  if (roomId.length !== 4) throw new Error("Invalid room id");
  return `presence-room-${roomId}`;
}

export function GetRoomId(name: string) {
  return name.split("-")[2];
}

export async function broadcastToRoom(roomId: string, event: unknown) {
  await Promise.all([
    revalidateRoom(roomId),
    pusher.trigger(RoomChannelName(roomId), "GAME_EVENT", event),
  ]);
}

export async function userIdsInRoom(channelName: string) {
  console.log("running user ids in room");
  let ids: string[] = [];
  const res = await pusher.get({
    path: "/channels/" + channelName + "/users",
  });
  if (res.status !== 200) {
    throw new Error("Error getting pusher users");
  }
  if (res.status === 200) {
    const body = await res.json();
    ids = body.users.map((u: any) => u.id);
  }
  return ids;
}

export async function userCountInRoom(channelName: string) {
  return (await userIdsInRoom(channelName)).length || 0;
}

export async function getTakenColors(channelName: string) {
  const ids = await userIdsInRoom(channelName);
  const colors: Color[] = [];
  for (let id of ids) {
    colors.push(await getUserColor(GetRoomId(channelName), id));
  }

  return colors;
}
