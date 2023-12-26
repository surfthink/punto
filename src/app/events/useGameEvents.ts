import { useState } from "react";
import GameLogic, { BoardState, Card } from "../_shared/gameLogic";
import {
  DrewCardEvent,
  GameOverEvent,
  NewGameEvent,
  PlacedCardEvent,
  PlayerInfo,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  PuntoEvent,
  TurnChangedEvent,
} from "./gameEvents";

export function useGameEvents() {
  const [board, setBoard] = useState<BoardState>();
  const [players, setPlayers] = useState<PlayerInfo[]>([]); //encodes the turn order
  const [currentCard, setCurrentCard] = useState<Card>();
  const [player, setPlayer] = useState<string>(); //id of the player
  const [turn, setTurn] = useState<string>(); // id of the player whose turn it is

  function update(events: PuntoEvent<unknown>[]) {
    let updateBoard: BoardState | undefined = undefined;
    let updatePlayers: PlayerInfo[] = [];
    let updatePlayer: string | undefined = undefined;
    let updateCurrentCard: Card | undefined = undefined;
    let updateTurn: string | undefined = undefined;

    events.forEach((event) => {
      let e;
      switch (event.action) {
        case "NEW_GAME":
          e = event as NewGameEvent;
          updateBoard = GameLogic.newBoard(11);
          updateTurn = e.data.player.id;
          // bring player to front
          updatePlayers = updatePlayers.filter((p) => p.id != updateTurn);
          updatePlayers = [e.data.player, ...updatePlayers];
          break;
        case "DRAW_CARD":
          e = event as DrewCardEvent;
          updateCurrentCard = e.data.card;
          break;
        case "CARD_PLACED":
          e = event as PlacedCardEvent;
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
          e = event as TurnChangedEvent;
          const front = updatePlayers.shift();
          if (front) updatePlayers = [...updatePlayers, front];
          updateTurn = updatePlayers[0].id;
          break;
        case "PLAYER_JOINED":
          e = event as PlayerJoinedEvent;
          updatePlayers = [...updatePlayers, e.data.player];
          break;
        case "PLAYER_LEFT":
          e = event as PlayerLeftEvent;
          const playerId = e.data.player.id;
          updatePlayers = updatePlayers.filter((p) => p.id != playerId);
          // if the player who left was the current player, then the turn changes
          //TODO
          break;
        case "GAME_OVER":
          e = event as GameOverEvent;
          window.alert(`Game over! ${e.data.winner.id} won!`);
          break;
        case "RESET":
          //all values are reset to initial state
          updateBoard = undefined;
          updateCurrentCard = undefined;
          updateTurn = undefined;
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
