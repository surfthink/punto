"use client";
import { useEffect, useState } from "react";
import { pusher } from "../pusher";
import { PuntoEvent } from "@/app/events/gameEvents";
import EventDrivenPunto from "@/app/events/EventDrivenPunto";
import { RoomChannelName } from "@/app/api/pusher/pusher";

export default function Page({ params }: { params: { id: string } }) {
  const [events, setEvents] = useState<PuntoEvent<unknown>[]>([]);
  // const [pusherChannel, setPusherChannel] = useState<Channel>();
  // const [members, setMembers] = useState<string[]>([]);

  const gameEventHandler = (event: PuntoEvent<unknown>) => {
    setEvents((events) => [...events, event]);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/room/${params.id}`);
      const body = await res.json();

      console.log(body);
      const channel = pusher.subscribe(RoomChannelName(params.id));
      channel.bind("pusher:subscription_succeeded", (members: any) => {
        // For example
        console.log("members", members);
        //TODO:
        // sort out a way to effectively set up the members so the the game can start
      });
      channel.bind("GAME_EVENT", gameEventHandler);
    })();

    return () => {
      pusher.unsubscribe(RoomChannelName(params.id));
      pusher.unbind("GAME_EVENT", gameEventHandler);
      pusher.unbind("pusher:subscription_succeeded");
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
    </>
  );
}
