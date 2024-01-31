"use client";
import { PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import { pusher } from "../pusher";
import { RoomChannelName } from "../api/pusher/pusher";
import { revalidateRoom } from "../_actions/room";

export default function RoomInvalidator({ roomId }: { roomId: string }) {
  const [channel, setChannel] = useState<PresenceChannel | null>(null);

  useEffect(() => {
    const channel = pusher.subscribe(
      RoomChannelName(roomId)
    ) as PresenceChannel;
    setChannel(channel);
    return () => {
      console.log("unsubscribing from channel");
      pusher.unsubscribe(RoomChannelName(roomId));
    };
  }, [roomId]);

  useEffect(() => {
    if (!channel) return;
    console.log("binding");
    channel.bind("GAME_EVENT", async (event: unknown) => {
      console.log("GAME_EVENT", event);
      await revalidateRoom(roomId);
    });

    return () => {
      console.log("unbinding");
      channel.unbind_all();
    };
  }, [channel]);
  return <></>;
}
