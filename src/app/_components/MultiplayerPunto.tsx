"use server";
import useRoomChannel from "../_hooks/useRoomChannel";
import { drawCard, getCurrentCard } from "../_actions/deck";
import { DrewCardEvent, PlayerInfo, PuntoEvent } from "../events/gameEvents";
import EventDrivenPunto from "../events/EventDrivenPunto";
import { getEvents, getUsernameCookie } from "../_actions/room";
import { Card } from "../_shared/gameLogic";
import { getBoard, place } from "../_actions/place";
import { getPlayerColors } from "../_actions/gameState";
import RoomInvalidator from "./RoomInvalidator";
import GameInterface from "./GameInterface";

export default async function MultiplayerPunto(props: {
  roomId: string;
  className?: string;
}) {
  const events = await getEvents(props.roomId);
  const username = await getUsernameCookie();
  const players = await getPlayerColors(props.roomId);
  const card = await getCurrentCard(props.roomId); //change to return a card object
  const board = await getBoard(props.roomId);

  return (
    <>
      <RoomInvalidator roomId={props.roomId}></RoomInvalidator>
      <GameInterface
        player={username}
        card={card}
        players={players}
        board={board}
      ></GameInterface>
    </>
  );
}
