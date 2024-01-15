"use client";
import { useEffect, useState } from "react";
import { pusher } from "../pusher";
import { DrewCardEvent, PuntoEvent } from "@/app/events/gameEvents";
import EventDrivenPunto from "@/app/events/EventDrivenPunto";
import { RoomChannelName } from "@/app/api/pusher/pusher";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";
import { useSession } from "next-auth/react";
import { Card, Color } from "@/app/_shared/gameLogic";

export default function Page({ params }: { params: { id: string } }) {
  const [events, setEvents] = useState<PuntoEvent<unknown>[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const { data: session, update, status } = useSession();
  const [cardValue, setCardValue] = useState<number>();
  const [color, setColor] = useState<Color>();
  const [players, setPlayers] = useState<{ id: string; color: Color }[]>([]);
  const [requestSent, setRequestSent] = useState<boolean>(false);

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

    channel = pusher.subscribe(RoomChannelName(params.id)) as PresenceChannel;
    console.log("subscribed to channel");
    channel.bind("GAME_EVENT", (event: PuntoEvent<unknown>) => {
      console.log("GAME_EVENT", event);
      switch (event.action) {
        case "NEW_GAME":
          handleNewGame();
      }
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

    return () => {
      pusher.unsubscribe(RoomChannelName(params.id));
      pusher.unbind("GAME_EVENT");
      pusher.unbind("pusher:subscription_succeeded");
      pusher.unbind("pusher:member_added");
      pusher.unbind("pusher:member_removed");
    };
  }, [color]);

  async function handleNewGame() {
    console.log("handleNewGame");
    const res = await fetch(`/api/room/${params.id}/playerColors`);
    const body = (await res.json()) as { id: string; color: Color }[];
    setPlayers(body);
    await drawCard();
  }

  function handlePlacement(x: number, y: number) {
    return async () => {
      if (requestSent) {
        return;
      }
      setRequestSent(true);
      console.log(`handlePlacement ${x} ${y}`);
      const res = await fetch(`/api/room/${params.id}/place`, {
        method: "POST",
        body: JSON.stringify({
          x,
          y,
          card: { value: cardValue, color: color } as Card,
        }),
      });
      setRequestSent(false);
      if (res.status !== 200) {
        console.log("failed to place card");
        return;
      }
      await drawCard();
    };
  }

  async function drawCard() {
    console.log("drawing card as ", color);
    const res = await fetch(`/api/room/${params.id}/draw`);
    const body = (await res.json()) as { cardValue: number };
    setEvents((events) => [
      ...events,
      {
        action: "DRAW_CARD",
        data: {
          card: {
            value: body.cardValue,
            color: color,
          },
        },
      } as DrewCardEvent,
    ]);
    setCardValue(body.cardValue);
  }

  async function handleStart() {
    console.log("handleStart");
    await fetch(`/api/room/${params.id}/start`);
  }

  return (
    <>
      <h1>Room {params.id}</h1>
      <div>Color:{color}</div>
      <div>
        Members:{" "}
        {members.map((member) => (
          <div key={member}>{member}</div>
        ))}
      </div>
      <EventDrivenPunto
        events={events}
        handlePlacement={handlePlacement}
        players={players}
        player={session?.user?.id!}
      ></EventDrivenPunto>
      {events.map((event, index) => (
        <div key={index}>{JSON.stringify(event)}</div>
      ))}
      {members.length >= 2 && events.length === 0 && (
        <button onClick={handleStart}>Start Game</button>
      )}{" "}
    </>
  );
}
