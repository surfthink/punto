import { Card, Color } from "@/app/_shared/gameLogic";

// so the client will sent card placed events to the server
// the server will broadcast card placed events to all clients along with all the other events that happen as a consequence of the card being placed

/**
 * Client -(card placed)-> Server
 * Server -(card placed)-(winner*)-(card drawn**)-(turn changed)-> All Clients
 *  * only if there is a winner
 *  ** only sent to the player that just played
 */

interface PuntoEvent<T> {
  action: string;
  data: T;
}

interface PlayerInfo {
  color: Color;
  id: string;
}

// received from server when you join
interface JoinedEvent
  extends PuntoEvent<{ players: PlayerInfo[]; playerId: string }> {
  action: "JOINED";
}

// received from server when someone else joins
interface PlayerJoinedEvent extends PuntoEvent<{ player: PlayerInfo }> {
  action: "PLAYER_JOINED";
}

interface PlayerLeftEvent extends PuntoEvent<{ player: PlayerInfo }> {
  action: "PLAYER_LEFT";
}

interface GameOverEvent extends PuntoEvent<{ winner: PlayerInfo }> {
  action: "GAME_OVER";
}

interface ResetEvent extends PuntoEvent<{ player: PlayerInfo }> {
  action: "RESET";
}

interface NewGameEvent extends PuntoEvent<{ player: PlayerInfo }> {
  action: "NEW_GAME";
}

interface DrewCardEvent extends PuntoEvent<{ card: Card }> {
  action: "DRAW_CARD";
}

interface TurnChangedEvent extends PuntoEvent<{ turn: Color }> {
  action: "TURN_CHANGED";
}
interface PlacedCardEvent
  extends PuntoEvent<{
    card: Card;
    x: number;
    y: number;
  }> {
  action: "CARD_PLACED";
}
