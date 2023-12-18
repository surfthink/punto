import { MouseEventHandler } from "react";
import Board from "./Board";
import { BoardState, Card, Color } from "../_hooks/GameLogic";
import Hand from "./Hand";

export default function GameInterface(props: {
  board?: BoardState;
  player?: Color;
  players?: Color[];
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
      {props.player && <p>You are {props.player}</p>}
      {props.players && props.players.length > 0 && (
        <p>
          Playing with:{" "}
          <div className="flex">
            {props.players.map((player) => (
              <div key={player}>{player}, </div>
            ))}
          </div>
        </p>
      )}
      {props.turn && <div>It is {props.turn}'s turn</div>}
      {props.card && (
        <Hand color={props.card.color} value={props.card.value}></Hand>
      )}
    </>
  );
}
