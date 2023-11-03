"use client";
import { useState } from "react";
import Board from "./Board";
import Hand from "./Hand";
import GameLogic from "./GameLogic";

/**
 * This component will be the brains of the punto game. It will have the grid display beneath it.
 * Will indicate who's turn it is
 * Will have the current card that can be placed by the player.
 *
 */
export default function Punto() {
  const [board, setBoard] = useState(GameLogic.newBoard(11));

  const handlePlacement = (x: number, y: number) => () => {
    setBoard(GameLogic.place([...board], x, y, "blue", 3));
  };

  return (
    <>
      <Board board={board} handlePlacement={handlePlacement}></Board>
      <Hand color="blue" value={3}></Hand>
    </>
  );
}
