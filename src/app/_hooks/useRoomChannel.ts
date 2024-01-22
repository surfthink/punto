import { Session } from "next-auth";
import { PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import { pusher } from "../pusher";
import { RoomChannelName } from "../api/pusher/pusher";
import { PuntoEvent } from "../events/gameEvents";
import { Color } from "../_shared/gameLogic";
import Cookies from "js-cookie";

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

  function reconnect() {
    console.log("reconnecting");
    setAttemptReconnect(!attemptReconnect);
  }

  useEffect(() => {
    let channel: PresenceChannel;

    // if (!Cookies.get("username")) return;
    console.log("connecting");
    channel = pusher.subscribe(RoomChannelName(roomId)) as PresenceChannel;
    console.log("subscribed to channel");
    channel.bind("GAME_EVENT", (event: PuntoEvent<unknown>) => {
      console.log("GAME_EVENT", event);
    });

    setChannel(channel);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("subscription_succeeded");
      console.log(channel.members);
      setMembers(Object.values(channel.members.members) as MemberInfo[]);
    });
    channel.bind("pusher:member_added", () => {
      console.log("member_added");
      setMembers(Object.values(channel.members.members) as MemberInfo[]);
    });
    channel.bind("pusher:member_removed", () => {
      console.log("member_removed");
      setMembers(Object.values(channel.members.members) as MemberInfo[]);
    });

    return () => {
      pusher.unsubscribe(RoomChannelName(roomId));
      // pusher.unbind("GAME_EVENT");
      pusher.unbind("pusher:subscription_succeeded");
      pusher.unbind("pusher:member_added");
      pusher.unbind("pusher:member_removed");
    };
  }, [attemptReconnect]);
  return { channel, members, reconnect };
}
