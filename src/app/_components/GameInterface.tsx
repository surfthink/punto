import { MouseEventHandler } from "react";
import Board from "./board/Board";
import { BoardState, Card, Color } from "../_shared/gameLogic";
import Hand from "./Hand";
import { PlayerInfo } from "../events/gameEvents";

export default function GameInterface(props: {
  board?: BoardState;
  player?: string;
  players?: PlayerInfo[];
  turn?: string;
  card?: Card;
  handlePlacement: (x: number, y: number) => MouseEventHandler<HTMLDivElement>;
  debug?: boolean;
}) {
  return (
    <>
      {props.card && (
        <Hand color={props.card.color} value={props.card.value}></Hand>
      )}
      {!!props.board && (
        <Board
          board={props.board}
          handlePlacement={props.handlePlacement}
          debug={props.debug || false}
        ></Board>
      )}
      {props.player && <p>You are {props.player}</p>}
      {props.players && props.players.length > 0 && (
        <div>
          Playing with:{" "}
          <div className="flex">
            {props.players.map((player) => (
              <p key={player.username}>
                id:{player.username}, color:{player.color}
              </p>
            ))}
          </div>
        </div>
      )}
      {props.turn && <div>It is {props.turn}&apos;s turn</div>}
    </>
  );
}
