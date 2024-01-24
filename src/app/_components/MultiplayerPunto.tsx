"use client";
import { useEffect, useState } from "react";
import useRoomChannel from "../_hooks/useRoomChannel";
import { drawCard, getCurrentCard } from "../_actions/deck";
import { DrewCardEvent, PlayerInfo, PuntoEvent } from "../events/gameEvents";
import EventDrivenPunto from "../events/EventDrivenPunto";
import { getEvents } from "../_actions/room";
import { Card } from "../_shared/gameLogic";
import { place } from "../_actions/place";

export default function MultiplayerPunto(props: {
  roomId: string;
  className?: string;
}) {
  const { channel, members, events, setEvents } = useRoomChannel(props.roomId);
  const [player, setPlayer] = useState<PlayerInfo>();
  const [players, setPlayers] = useState<PlayerInfo[]>();
  const [card, setCard] = useState<Card>();

  useEffect(() => {
    if (!members) return;
    init(events);
  }, [members, channel, events, player]);

  async function init(events: PuntoEvent<unknown>[]) {
    if (events.length > 0) return;
    if (!channel) return;
    if (!player) setPlayer({ ...channel?.members.me.info } as PlayerInfo);
    if (!players) setPlayers([...members!]);
    await getPreviousEvents(props.roomId);
    if (channel.members.me.info.color)
      setCard({
        value: await getCurrentCard(props.roomId),
        color: channel.members.me.info.color,
      });
  }

  async function getPreviousEvents(roomId: string) {
    const prevEvents = await getEvents(roomId);
    console.log("previous events", prevEvents);
    setEvents((events) => [...events, ...prevEvents]);
  }

  async function draw() {
    const card = await drawCard(props.roomId);
    setCard({ value: card, color: player?.color! });
  }

  function handlePlacement(x: number, y: number) {
    return async () => {
      if (!card || !card.color || !card.value) return;
      const cardToBePlaced = { ...card };
      setCard(undefined);
      try {
        await place(
          { c: cardToBePlaced.color!, v: cardToBePlaced.value!, x, y },
          props.roomId
        );
        await draw();
      } catch (e) {
        console.log(e);
        setCard(cardToBePlaced);
      }
    };
  }

  return (
    <EventDrivenPunto
      events={events}
      player={player?.username!}
      players={members!}
      card={card!}
      debug={true}
      handlePlacement={handlePlacement}
      className={props.className}
    ></EventDrivenPunto>
  );
}
