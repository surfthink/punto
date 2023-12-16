import { useState } from "react";
import GameLogic, { BoardState, Card, Color } from "./GameLogic";
import {
  DrawCard,
  NewGame,
  PlaceCard,
  PlayerJoined,
  PuntoEvent,
  TurnChange,
} from "../development/events/EventDrivenPunto";

export function useGameLogic() {
  const [board, setBoard] = useState<BoardState>();
  // also encodes the turn order
  const [players, setPlayers] = useState<Color[]>([]);
  const [currentCard, setCurrentCard] = useState<Card>();
  const [player, setPlayer] = useState<Color>();
  const [turn, setTurn] = useState<Color>();

  function update(events: PuntoEvent[]) {
    let updateBoard: BoardState | undefined = undefined;
    let updatePlayers: Color[] = [];
    let updatePlayer: Color | undefined = undefined;
    let updateCurrentCard: Card | undefined = undefined;
    let updateTurn: Color | undefined = undefined;

    events.forEach((event) => {
      let e;
      switch (event.action) {
        case "NEW_GAME":
          e = event as NewGame;
          updateBoard = GameLogic.newBoard(11);
          updateTurn = e.data.player;
          // bring player to front
          updatePlayers = updatePlayers.filter((p) => p != updateTurn);
          updatePlayers = [e.data.player, ...updatePlayers];
          break;
        case "DRAW_CARD":
          e = event as DrawCard;
          updateCurrentCard = e.data.card;
          break;
        case "CARD_PLACED":
          e = event as PlaceCard;
          if (!updateBoard) {
            throw new Error("board not initialized");
          }
          const { placed, newBoard } = GameLogic.place(
            [...updateBoard],
            e.data.x,
            e.data.y,
            e.data.card.color,
            e.data.card.value
          );
          if (!placed) {
            throw new Error("card not placed");
          }
          updateBoard = [...newBoard];
          break;
        case "TURN_CHANGED":
          e = event as TurnChange;
          const front = updatePlayers.shift();
          if (front) updatePlayers = [...updatePlayers, front];
          updateTurn = updatePlayers[0];
          break;
        case "PLAYER_JOINED":
          e = event as PlayerJoined;
          updatePlayers = [...updatePlayers, e.data.player];
          updatePlayer = e.data.player;
          break;
        default:
          throw new Error(`Unknown event: ${event.action}`);
      }
    });
    if (updateBoard) setBoard([...updateBoard]);
    if (updatePlayers) setPlayers([...updatePlayers]);
    if (updatePlayer) setPlayer(updatePlayer);
    if (updateCurrentCard) setCurrentCard(updateCurrentCard);
    if (updateTurn) setTurn(updateTurn);
  }

  return {
    board,
    players,
    player,
    currentCard,
    turn,
    update,
  };
}
