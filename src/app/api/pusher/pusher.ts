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
