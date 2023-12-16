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
  };
}
export interface DrawCard extends PuntoEvent {
  action: "DRAW_CARD";
  data: {
    card: Card;
  };
}

export interface TurnChange extends PuntoEvent {
  action: "TURN_CHANGED";
  data: {
    turn: Color;
  };
}
export interface PlaceCard extends PuntoEvent {
  action: "CARD_PLACED";
  data: {
    card: Card;
    x: number;
    y: number;
  };
}

export interface PlayerJoined extends PuntoEvent {
  action: "PLAYER_JOINED";
  data: {
    player: Color;
  };
}

export default function EventDrivenPunto(props: { events: PuntoEvent[] }) {
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
