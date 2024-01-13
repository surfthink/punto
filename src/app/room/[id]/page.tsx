"use client";
import { useEffect, useState } from "react";
import { pusher } from "../pusher";
import { PuntoEvent } from "@/app/events/gameEvents";
import EventDrivenPunto from "@/app/events/EventDrivenPunto";
import { RoomChannelName } from "@/app/api/pusher/pusher";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";
import { useSession } from "next-auth/react";
import { Color } from "@/app/_shared/gameLogic";

const COLORS = [Color.BLUE, Color.GREEN, Color.RED, Color.YELLOW];

export default function Page({ params }: { params: { id: string } }) {
  const [events, setEvents] = useState<PuntoEvent<unknown>[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const session = useSession();

  //get react router
  const router = useRouter();

  useEffect(() => {
    let channel: PresenceChannel;

    function updateMembers() {
      const updateMembers: string[] = [];
      channel.members.each((member: Session["user"]) => {
        updateMembers.push(member.id!);
      });
      setMembers(updateMembers);
    }

    async function fetchColor() {
      const res = await fetch(`/api/room/${params.id}`);
      const body = (await res.json()) as { color: Color };
      setColor(body.color);
      if (res.status !== 200) {
        router.push("/");
      }
    }

    fetchColor();
      channel.bind("GAME_EVENT", (event: PuntoEvent<unknown>) => {
        console.log("GAME_EVENT");
        setEvents((events) => [...events, event]);
      });

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
      pusher.unbind("GAME_EVENT");
      pusher.unbind("pusher:subscription_succeeded");
      pusher.unbind("pusher:member_added");
      pusher.unbind("pusher:member_removed");
    };
  }, [color]);

  function handlePlacement(x: number, y: number) {
    return () => {
      console.log(`handlePlacement ${x} ${y}`);
    };
  }

  async function handleStart() {
    console.log("handleStart");
    fetch(`/api/room/${params.id}/start`);
  }

  return (
    <>
      <h1>Room {params.id}</h1>
      <EventDrivenPunto
        events={events}
        handlePlacement={handlePlacement}
        players={members.map((member, index) => ({
          id: member,
          color: COLORS[index],
        }))}
        player={session.data?.user?.id!}
      ></EventDrivenPunto>
      {events.map((event, index) => (
        <div key={index}>{JSON.stringify(event)}</div>
      ))}

      {members.length >= 2 && events.length === 0 && (
        <button onClick={handleStart}>Start Game</button>
      )}
    </>
  );
}
