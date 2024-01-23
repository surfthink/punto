"use client";
import { useEffect } from "react";
import GameInterface from "../_components/GameInterface";
import { useGameEvents } from "./useGameEvents";
import { PlayerInfo, PuntoEvent } from "@/app/events/gameEvents";
import { Card } from "../_shared/gameLogic";

export default function EventDrivenPunto(props: {
  events: PuntoEvent<unknown>[];
  handlePlacement: (x: number, y: number) => () => void;
  players: PlayerInfo[];
  player: string;
  card: Card;
  debug: boolean;
}) {
  const { board, turn, update } = useGameEvents();

  useEffect(() => {
    if (props.events.length > 0) {
      update(props.events);
    }
  }, [props.events]);

  return (
    <>
      <GameInterface
        board={board}
        card={props.card}
        turn={turn}
        player={props.player}
        players={props.players}
        handlePlacement={props.handlePlacement}
        debug={props.debug}
      ></GameInterface>
    </>
  );
}
