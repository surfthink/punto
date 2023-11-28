"use client";
import { useEffect } from "react";
import { Card, Color } from "./GameLogic";
import GameInterface from "./GameInterface";
import { useGameLogic } from "../_hooks/useGameLogic";

export interface PuntoEvent {
  action: string;
  data: any;
}

export interface NewGame extends PuntoEvent {
  action: "NEW_GAME";
  data: {
    player: Color;
    players: Color[];
  };
}
interface DrawCard extends PuntoEvent {
  action: "DRAW";
  data: {
    card: Card;
  };
}
interface PlaceCard extends PuntoEvent {
  action: "PLACE";
  data: {
    card: Card;
    x: number;
    y: number;
  };
}

export default function EventDrivenPunto(props: { events: PuntoEvent[] }) {
  const { board, player, players, currentCard, currentTurn, update } =
    useGameLogic();

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
      turn={currentTurn}
      player={player}
      handlePlacement={handlePlacement}
    ></GameInterface>
  );
}
