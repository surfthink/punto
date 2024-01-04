"use client";
import { useEffect, useState } from "react";
import { pusher } from "../pusher";
import { PuntoEvent } from "@/app/events/gameEvents";
import EventDrivenPunto from "@/app/events/EventDrivenPunto";
import { RoomChannelName } from "@/app/api/pusher/pusher";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";

interface SubscriptionSucceededEvent {
  count: number;
  me: { id: string; info: Session };
  members: { [key: string]: Session["user"] };
  myID: string;
}

interface MemberAddedEvent {
  id: string;
  info: Session["user"];
}

export default function Page({ params }: { params: { id: string } }) {
  const [events, setEvents] = useState<PuntoEvent<unknown>[]>([]);
  const [members, setMembers] = useState<string[]>([]);

  //get react router
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/room/${params.id}`);
      const body = await res.json();
      if (res.status !== 200) {
        router.push("/");
        throw new Error(body.error);
      }

      const channel = pusher.subscribe(
        RoomChannelName(params.id)
      ) as PresenceChannel;

      function updateMembers() {
        const updateMembersList: string[] = [];
        channel.members.each((member: Session["user"]) => {
          updateMembersList.push(member.id!);
        });
        setMembers([...updateMembersList]);
      }

      channel.bind("pusher:subscription_succeeded", () => {
        console.log("subscription_succeeded");
        updateMembers();
      });
      channel.bind("pusher:member_added", () => {
        console.log("member_added");
        updateMembers();
      });
      channel.bind("pusher:member_removed", () => {
        console.log("member_removed");
        updateMembers();
      });
    })();

    return () => {
      pusher.unsubscribe(RoomChannelName(params.id));
      pusher.unbind("pusher:subscription_succeeded");
      pusher.unbind("pusher:member_added");
      pusher.unbind("pusher:member_removed");
    };
  }, []);

  function handlePlacement(x: number, y: number) {
    console.log("handlePlacement");
    return () => {
      console.log(`handlePlacement ${x} ${y}`);
    };
  }

  return (
    <>
      <h1>Room {params.id}</h1>
      <EventDrivenPunto
        events={events}
        handlePlacement={handlePlacement}
      ></EventDrivenPunto>
      {members.map((member, index) => (
        <div key={index}>{member}</div>
      ))}
    </>
  );
}
