import { Color } from "@/app/_components/GameLogic";

export interface PuntoEvent<T> {
  eventType: string;
  data: T;
}

export interface GeneralPlayerInfo {
  color: Color;
  id: string;
}

export interface PlayerJoinInfo {
  players: GeneralPlayerInfo[];
}
export interface JoinedInfo {
  players: GeneralPlayerInfo[];
  playerId: string;
  roomId: string;
}

export interface JoinedEvent extends PuntoEvent<JoinedInfo> {
  eventType: "JOINED";
}

export interface PlayerJoinedEvent extends PuntoEvent<PlayerJoinInfo> {
  eventType: "PLAYER_JOINED";
}

export interface PlayerLeftEvent extends PuntoEvent<PlayerJoinInfo> {
  eventType: "PLAYER_LEFT";
}
