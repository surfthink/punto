"use client";
import { useEffect } from "react";
import GameInterface from "../_components/GameInterface";
import { useGameEvents } from "./useGameEvents";
import { PlayerInfo, PuntoEvent } from "@/app/events/gameEvents";

export default function EventDrivenPunto(props: {
  events: PuntoEvent<unknown>[];
  handlePlacement: (x: number, y: number) => () => void;
  players: PlayerInfo[];
  player: string;
  debug: boolean;
}) {
  const { board, player, players, currentCard, turn, update } = useGameEvents();

  useEffect(() => {
    console.log(props.players);
    if (props.events.length > 0) {
      update(props.events);
    }
  }, [props.events]);

  return (
    <GameInterface
      board={board}
      card={currentCard}
      turn={turn}
      player={props.player}
      players={props.players}
      handlePlacement={props.handlePlacement}
      debug={props.debug}
    ></GameInterface>
  );
}
