import { MouseEventHandler } from "react";
import Board from "./Board";
import { BoardState, Card, Color } from "./GameLogic";
import Hand from "./Hand";

export default function GameInterface(props: {
  board?: BoardState;
  player?: Color;
  turn?: Color;
  card?: Card;
  handlePlacement: (x: number, y: number) => MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <>
      {!!props.board && (
        <Board
          board={props.board}
          handlePlacement={props.handlePlacement}
        ></Board>
      )}
      {props.player && <div>You are {props.player}</div>}
      {props.turn && <div>It is {props.turn}'s turn</div>}
      {props.card && (
        <Hand color={props.card.color} value={props.card.value}></Hand>
      )}
    </>
  );
}
