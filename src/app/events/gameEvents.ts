import { Card, Color } from "@/app/_shared/gameLogic";

export interface PuntoEvent<T> {
  action: string;
  data: T;
}

export interface PlayerInfo {
  color: Color;
  id: string;
}

// received from server when you join
export interface JoinedEvent
  extends PuntoEvent<{ players: PlayerInfo[]; playerId: string }> {
  action: "JOINED";
}

// received from server when someone else joins
export interface PlayerJoinedEvent extends PuntoEvent<{ player: PlayerInfo }> {
  action: "PLAYER_JOINED";
}

export interface PlayerLeftEvent extends PuntoEvent<{ player: PlayerInfo }> {
  action: "PLAYER_LEFT";
}

export interface GameOverEvent extends PuntoEvent<{ winner: PlayerInfo }> {
  action: "GAME_OVER";
}

export interface ResetEvent extends PuntoEvent<{ player: PlayerInfo }> {
  action: "RESET";
}

export interface NewGameEvent extends PuntoEvent<{ player: PlayerInfo }> {
  action: "NEW_GAME";
}

export interface DrewCardEvent extends PuntoEvent<{ card: Card }> {
  action: "DRAW_CARD";
}

export interface TurnChangedEvent extends PuntoEvent<{ turn: Color }> {
  action: "TURN_CHANGED";
}
export interface PlacedCardEvent
  extends PuntoEvent<{
    card: Card;
    x: number;
    y: number;
  }> {
  action: "CARD_PLACED";
}
