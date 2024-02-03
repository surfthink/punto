import { getCurrentCard } from "../_actions/deck";
import { getUsernameCookie } from "../_actions/room";
import { getBoard } from "../_actions/place";
import { getPlayerColors, getTurn, getWinner } from "../_actions/gameState";
import RoomInvalidator from "./RoomInvalidator";
import GameInterface from "./GameInterface";
import { RoomState } from "../_shared/gameLogic";
import { GameFinishedAlert } from "./dialog/GameFinishedAlert";

export default async function MultiplayerPunto(props: {
  roomId: string;
  className?: string;
  roomState: RoomState;
}) {
  const username = await getUsernameCookie();
  const players = await getPlayerColors(props.roomId);
  const card = await getCurrentCard(props.roomId); //change to return a card object
  const board = await getBoard(props.roomId);
  const turn = await getTurn(props.roomId);
  const winner = await getWinner(props.roomId);

  return (
    <>
      <RoomInvalidator roomId={props.roomId}></RoomInvalidator>
      <GameFinishedAlert
        roomState={props.roomState}
        winner={winner}
        board={board}
      />
      <GameInterface
        player={username}
        card={card}
        players={players}
        board={board}
        turn={turn}
      ></GameInterface>
    </>
  );
}
