"use client";
import { useEffect } from "react";
import GameInterface from "../../_components/GameInterface";
import { useGameLogic } from "../../_hooks/useGameLogic";
import { PuntoEvent } from "@/app/_hooks/interfaces";

export default function EventDrivenPunto(props: {
  events: PuntoEvent<unknown>[];
}) {
  const { board, player, players, currentCard, turn, update } = useGameLogic();

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
