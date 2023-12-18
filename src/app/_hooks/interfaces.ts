import { Card, Color } from "@/app/_hooks/GameLogic";

export interface PuntoEvent<T> {
  action: string;
  data: T;
}

export interface GeneralPlayerInfo {
  color: Color;
  id: string;
}

export interface JoinedEvent
  extends PuntoEvent<{ players: GeneralPlayerInfo[]; playerId: string }> {
  action: "JOINED";
}

export interface PlayerJoinedEvent
  extends PuntoEvent<{ players: GeneralPlayerInfo[] }> {
  action: "PLAYER_JOINED";
}

export interface PlayerLeftEvent extends PuntoEvent<GeneralPlayerInfo> {
  action: "PLAYER_LEFT";
}

export interface GameOverEvent extends PuntoEvent<GeneralPlayerInfo> {
  action: "GAME_OVER";
}

export interface ResetEvent extends PuntoEvent<GeneralPlayerInfo> {
  action: "RESET";
}

export interface NewGameEvent extends PuntoEvent<GeneralPlayerInfo> {
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
