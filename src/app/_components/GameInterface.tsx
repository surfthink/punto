import Board from "./board/Board";
import { BoardState, Card } from "../_shared/gameLogic";
import Hand from "./Hand";
import InviteLinkCard from "./cards/InviteLinkCard";
import { PlayerInfo } from "../_actions/room";

export default function GameInterface(props: {
  board?: BoardState;
  player?: string;
  players?: PlayerInfo[];
  turn?: string;
  card?: Card;
  debug?: boolean;
  className?: string;
}) {
  return (
    <div className="grid grid-rows-6 h-screen w-full md:aspect-square md:max-h-[100vw] md:max-w-[100vh] border border-red overflow-hidden">
      <div className="row-span-1 border w-full flex items-center justify-center">
        <Hand
          color={!props.card ? undefined : props.card.color}
          value={!props.card ? undefined : props.card.value}
        ></Hand>
      </div>
      {/* <div className="row-span-4 h-full flex flex-col items-center justify-center"> */}
      <div className="border row-span-3 h-full max-h-[100vw] flex items-center justify-center">
        <Board board={props.board} debug={props.debug || false}></Board>
      </div>
      {/* </div> */}
      <div className="row-span-2 grid grid-cols-2 border w-full"></div>
    </div>
  );
}
