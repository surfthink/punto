import { useState } from "react";
import GameLogic, { BoardState, Card, Color } from "../_components/GameLogic";
import {
  DrawCard,
  NewGame,
  PlaceCard,
  PuntoEvent,
  TurnChange,
} from "../_components/EventDrivenPunto";

export function useGameLogic() {
  const [board, setBoard] = useState<BoardState>();
  // also encodes the turn order
  const [players, setPlayers] = useState<Color[]>([]);
  const [currentCard, setCurrentCard] = useState<Card>();
  const [player, setPlayer] = useState<Color>();
  const [turn, setTurn] = useState<Color>();

  function update(events: PuntoEvent[]) {
    let updateBoard: BoardState | undefined = undefined;
    let updatePlayers: Color[] | undefined = undefined;
    let updatePlayer: Color | undefined = undefined;
    let updateCurrentCard: Card | undefined = undefined;
    let updateTurn: Color | undefined = undefined;

    events.forEach((event) => {
      let e;
      switch (event.action) {
        case "NEW_GAME":
          e = event as NewGame;
          updateBoard = GameLogic.newBoard(11);
          updatePlayers = e.data.players;
          updatePlayer = e.data.player;
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
          updateTurn = e.data.turn;
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
