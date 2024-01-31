import { getCurrentCard } from "../_actions/deck";
import { getUsernameCookie } from "../_actions/room";
import { getBoard } from "../_actions/place";
import { getPlayerColors, getTurn } from "../_actions/gameState";
import RoomInvalidator from "./RoomInvalidator";
import GameInterface from "./GameInterface";

export default async function MultiplayerPunto(props: {
  roomId: string;
  className?: string;
}) {
  const username = await getUsernameCookie();
  const players = await getPlayerColors(props.roomId);
  const card = await getCurrentCard(props.roomId); //change to return a card object
  const board = await getBoard(props.roomId);
  const turn = await getTurn(props.roomId);

  return (
    <>
      <RoomInvalidator roomId={props.roomId}></RoomInvalidator>
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
