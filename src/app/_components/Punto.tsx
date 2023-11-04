"use client";
import { useEffect, useState } from "react";
import Board from "./Board";
import Hand from "./Hand";
import GameLogic, { Card, Color } from "./GameLogic";

type Deck = Card[];
type Decks = {
  [key in Color]: Deck;
};

function shuffle<T>(array: T[]) {
  return array.sort(() => Math.random() - 0.5);
}

function initDecks(colors: Color[]) {
  const decks: Decks = {} as Decks;
  colors.forEach((c) => {
    const deck: Deck = [];
    const color = c;
    for (let value = 1; value < 10; value++) {
      deck.push({ value, color });
      deck.push({ value, color });
      //two of each card
    }
    decks[color] = shuffle<Card>(deck);
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
  const [players, setPlayers] = useState<Color[]>([
    "red",
    "blue",
    "green",
    "yellow",
  ]);
  const emptyDecks = () => {
    const d: Decks = {} as Decks; // would love to know the better way to do this
    players.forEach((p) => (d[p] = []));
    return d;
  };
  // the top of each deck will be the hand
  const [decks, setDecks] = useState<Decks>({ ...emptyDecks() });
  const [board, setBoard] = useState(GameLogic.newBoard(11));

  useEffect(() => {
    setDecks({ ...initDecks(players) }); // set the state here to avoid ssr conflict
  }, []);

  const handlePlacement = (x: number, y: number) => () => {
    const deck = decks[players[0]];

    if (!!deck && deck.length > 0) {
      const card = deck[0];
      const { newBoard, placed } = GameLogic.place(
        [...board],
        x,
        y,
        card.color,
        card.value
      );
      if (placed) {
        setBoard([...newBoard]);
        drawCard(players[0]);
        nextPlayer();
        return;
      }
      window.alert("You cannot place that card here");
      return;
    }
  };

  const nextPlayer = () => {
    setPlayers([...players.slice(1), players[0]]);
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
      {!!decks[players[0]] && decks[players[0]].length > 0 && (
        <Hand color={players[0]} value={decks[players[0]][0].value}></Hand>
      )}
    </>
  );
}
