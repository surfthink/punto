import { MouseEventHandler } from "react";
import Board from "./Board";
import { BoardState, Card, Color } from "../_hooks/GameLogic";
import Hand from "./Hand";
import { PlayerInfo } from "../_hooks/interfaces";

export default function GameInterface(props: {
  board?: BoardState;
  player?: string;
  players?: PlayerInfo[];
  turn?: string;
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
        <div>
          Playing with:{" "}
          <div className="flex">
            {props.players.map((player) => (
              <p key={player.id}>
                id:{player.id}, color:{player.color}
              </p>
            ))}
          </div>
        </div>
      )}
      {props.turn && <div>It is {props.turn}&apos;s turn</div>}
      {props.card && (
        <Hand color={props.card.color} value={props.card.value}></Hand>
      )}
    </>
  );
}
