"use server";

import {
  PlayerInfo,
  expireGameKeys,
  getUserColor,
  roomExists,
  setUserColor,
} from "./room";
import { broadcastToRoom } from "../api/pusher/pusher";
import { REDIS_GAME_KEY, db } from "../api/db/redis";
import { Color, RoomState } from "../_shared/gameLogic";
import { revalidatePath } from "next/cache";
import { drawCard, initDeck} from "./deck";
import start_game_script from "./scripts/start_game.lua"

export async function start(
  roomId: string,
  players: string[],
  formData: FormData
) {
  if (await !roomExists(roomId)) {
    throw new Error("Room does not exist");
  }
  try{
    await startGame(roomId, players);
    await broadcastToRoom(roomId, {
      action: "TURN_CHANGED",
    });
  } catch (e){
    console.log("the game has already started")
  }
  revalidatePath(`/room/${roomId}`);
}

const COLORS = [Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW];
const POSSIBLE_CARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];




async function startGame(roomId: string, players: string[]) {

  const transaction = await db.eval(start_game_script,[
    REDIS_GAME_KEY.stateObject(''),
  ],[roomId]);

  if (transaction === 0){
    throw new Error('Game has already started')
  }

  await Promise.all([
    db.rpush(REDIS_GAME_KEY.orderList(roomId), ...players),
    db.sadd(REDIS_GAME_KEY.playerSet(roomId), ...players),
    ...players.map(async (player, i) => await setUserColor(roomId, player, COLORS[i])),
    ...players.map(async (player) => await initDeck(roomId, player)),
  ])

  await Promise.all([...players.map((player) => drawCard(roomId, player))])

  await expireGameKeys(roomId);
}


export async function getOrderOfRoom(roomId: string) {
  return await db.lrange(REDIS_GAME_KEY.orderList(roomId), 0, -1);
}

export async function getPlayerColors(roomId: string) {
  const players = await getOrderOfRoom(roomId);
  const colors: PlayerInfo[] = await Promise.all(
    players.map(async (player) => ({
      username: player,
      color: await getUserColor(roomId, player),
    }))
  );
  return colors;
}

export async function playerInRoom(roomId: string, username: string) {
  return (await db.sismember(REDIS_GAME_KEY.playerSet(roomId), username)) === 1;
}

export async function endGame(roomId: string) {
  await db.hset(REDIS_GAME_KEY.stateObject(roomId), {
    state: RoomState.FINISHED,
  });
}

export async function setWinner(roomId: string, username: string) {
  await db.hset(REDIS_GAME_KEY.stateObject(roomId), { winner: username });
}
export async function getWinner(roomId: string) {
  return (await db.hget(REDIS_GAME_KEY.stateObject(roomId), "winner")) as
    | string
    | null;
}

export async function getRoomState(roomId: string) {
  return (await db.hget(
    REDIS_GAME_KEY.stateObject(roomId),
    "state"
  )) as RoomState;
}

export async function nextTurn(roomId: string) {
  const turn = await db.hincrby(REDIS_GAME_KEY.stateObject(roomId), "turn", 1);
  return turn;
}

export async function getTurn(roomId: string) {
  const [turn, players] = await Promise.all([
    db.hget(REDIS_GAME_KEY.stateObject(roomId), "turn"),
    db.lrange(REDIS_GAME_KEY.orderList(roomId), 0, -1),
  ]);
  return players[(turn as number) % players.length];
}
