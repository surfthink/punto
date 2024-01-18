"use client";
import { useEffect, useState } from "react";
import { pusher } from "../../pusher";
import { DrewCardEvent, PuntoEvent } from "@/app/events/gameEvents";
import EventDrivenPunto from "@/app/events/EventDrivenPunto";
import { RoomChannelName } from "@/app/api/pusher/pusher";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";
import { useSession } from "next-auth/react";
import { Card, Color } from "@/app/_shared/gameLogic";
import { place } from "@/app/_actions/place";
import { drawCard } from "@/app/_actions/deck";

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
    await draw();
  }

  function logError(e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log(JSON.stringify(e));
    }
  }

  function handlePlacement(x: number, y: number) {
    return async () => {
      try {
        if (!cardValue) throw new Error("cardValue is undefined");
        if (!color) throw new Error("color is undefined");
        await place({ x, y, c: color!, v: cardValue! }, params.id);
      } catch (e: unknown) {
        logError(e);
        return;
      }
      await draw();
    };
  }

  async function draw() {
    try {
      const value = await drawCard(params.id, session?.user.id!);
      const drawEvent: DrewCardEvent = {
        action: "DRAW_CARD",
        data: {
          card: {
            value: value,
            color: color!,
          },
        },
      };
      console.log("GAME_EVENT", drawEvent);
      setEvents((events) => [...events, drawEvent]);
      // this is confused... we should not have the value in the state here I dont think
      setCardValue(value);
    } catch (e: unknown) {
      logError(e);
    }
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
        debug={true}
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
