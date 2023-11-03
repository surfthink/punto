"use client";
import { useState } from "react";
import Board from "./Board";
import Hand from "./Hand";
import GameLogic, { Card, Color } from "./GameLogic";

type Deck = Card[];
type Decks = {
  [key in Color]?: Deck;
};

function initDecks(colors: Color[]) {
  const decks: Decks = {};
  console.log(colors);
  colors.forEach((c) => {
    const deck: Deck = [];
    const color = c;
    for (let value = 1; value < 10; value++) {
      deck.push({ value, color });
    }
    decks[color] = deck;
  });
  console.log("init decks", decks);
  return decks;
}

/**
 * This component will be the brains of the punto game. It will have the grid display beneath it.
 * Will indicate who's turn it is
 * Will have the current card that can be placed by the player.
 *
 */
export default function Punto() {
  const [board, setBoard] = useState(GameLogic.newBoard(11));
  // the top of each deck will be the hand
  const [decks, setDecks] = useState({ ...initDecks(["blue"]) });
  const [player, setPlayer] = useState<Color>("blue"); // this will probably need to change into a more complex object

  const handlePlacement = (x: number, y: number) => () => {
    const deck = decks[player];

    console.log("handlePlacement");
    if (!!deck && deck.length > 0) {
      const card = deck[0];
      setBoard([...GameLogic.place([...board], x, y, card.color, card.value)]);
      drawCard(player);
    }
  };

  const drawCard = (color: Color) => {
    const deck = decks[color];
    if (!deck) throw new Error("Deck color does not exist");
    // new deck has everything but the top element
    setDecks({ ...decks, [color]: deck.slice(1) });
  };

  return (
    <>
      <Board board={board} handlePlacement={handlePlacement}></Board>
      <Hand color="blue" value={3}></Hand>
    </>
  );
}
