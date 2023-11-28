import { useState } from "react";
import GameLogic, { BoardState, Card, Color } from "../_components/GameLogic";
import { NewGame, PuntoEvent } from "../_components/EventDrivenPunto";

export function useGameLogic() {
  const [board, setBoard] = useState<BoardState>();
  // also encodes the turn order
  const [players, setPlayers] = useState<Color[]>([]);
  const [currentCard, setCurrentCard] = useState<Card>();
  const [player, setPlayer] = useState<Color>();

  function update(events: PuntoEvent[]) {
    events.forEach((event) => {
      switch (event.action) {
        case "NEW_GAME":
          const e = event as NewGame;
          setBoard(GameLogic.newBoard(11));
          setPlayers(e.data.players);
          setPlayer(e.data.player);
          break;
      }
    });
  }

  return {
    board,
    players,
    player,
    currentCard,
    currentTurn: players[0],
    update,
  };
}
