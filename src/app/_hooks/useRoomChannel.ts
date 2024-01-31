import { PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import { pusher } from "../pusher";
import { RoomChannelName } from "../api/pusher/pusher";
import { Color } from "../_shared/gameLogic";
import { useRouter } from "next/navigation";
import { revalidateRoom } from "../_actions/room";

// Finish this hook

interface MemberInfo {
  color: Color;
  username: string;
}
[];

export default function useRoomChannel(roomId: string) {
  const [channel, setChannel] = useState<PresenceChannel | null>(null);
  const [members, setMembers] = useState<MemberInfo[]>();
  const [attemptReconnect, setAttemptReconnect] = useState(false);
  const router = useRouter();

  function reconnect() {
    console.log("reconnecting");
    setAttemptReconnect(!attemptReconnect);
  }

  useEffect(() => {
    console.log("connecting to channel");
    const channel = pusher.subscribe(
      RoomChannelName(roomId)
    ) as PresenceChannel;
    setChannel(channel);
    return () => {
      console.log("unsubscribing from channel");
      pusher.unsubscribe(RoomChannelName(roomId));
    };
  }, [roomId, attemptReconnect]);

  useEffect(() => {
    if (!channel) return;
    console.log("binding");
    channel.bind("GAME_EVENT", async (event: unknown) => {
      console.log("GAME_EVENT", event);
      await revalidateRoom(roomId);
    });
    channel.bind("pusher:subscription_succeeded", () => {
      setMembers(Object.values(channel.members.members) as MemberInfo[]);
    });
    channel.bind("pusher:member_added", () => {
      setMembers(Object.values(channel.members.members) as MemberInfo[]);
    });
    channel.bind("pusher:member_removed", () => {
      setMembers(Object.values(channel.members.members) as MemberInfo[]);
    });

    return () => {
      console.log("unbinding");
      channel.unbind_all();
    };
  }, [channel]);
  return { channel, members, reconnect };
}
