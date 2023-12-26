"use client";
import { useEffect } from "react";
import GameInterface from "../_components/GameInterface";
import { useGameEvents } from "./useGameEvents";
import { PuntoEvent } from "@/app/events/gameEvents";

export default function EventDrivenPunto(props: {
  events: PuntoEvent<unknown>[];
}) {
  const { board, player, players, currentCard, turn, update } = useGameEvents();

  useEffect(() => {
    if (props.events.length > 0) {
      update(props.events);
    }
  }, [props.events]);

  function handlePlacement(x: number, y: number) {
    console.log("handlePlacement");
    return () => {
      console.log(`handlePlacement ${x} ${y}`);
    };
  }

  return (
    <GameInterface
      board={board}
      card={currentCard}
      turn={turn}
      player={player}
      players={players}
      handlePlacement={handlePlacement}
    ></GameInterface>
  );
}
