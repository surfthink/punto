import { MouseEventHandler } from "react";
import Board from "./board/Board";
import { BoardState, Card, Color } from "../_shared/gameLogic";
import Hand from "./Hand";
import { PlayerInfo } from "../events/gameEvents";
import PlayerRoomCard from "./cards/PlayerRoomCard";
import { cn } from "@/lib/utils";

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
      <Hand
        color={!props.card ? undefined : props.card.color}
        value={!props.card ? undefined : props.card.value}
      ></Hand>

      {!!props.board && (
        <Board
          board={props.board}
          handlePlacement={props.handlePlacement}
          debug={props.debug || false}
        ></Board>
      )}
      {props.players && props.players.length > 0 && (
        //make this responsive
        <div>
          {props.players.map((player) => (
            <div
              key={player.username}
              className={cn(props.turn === player.username ? "ring" : "")}
            >
              <PlayerRoomCard
                key={player.username}
                color={player.color}
                username={player.username}
              ></PlayerRoomCard>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
