import { Redis } from "@upstash/redis";

function getRedisConfig() {
  if (
    !process.env.NEXT_PUBLIC_REDIS_URL ||
    process.env.NEXT_PUBLIC_REDIS_URL.length === 0
  ) {
    throw new Error("NEXT_PUBLIC_REDIS_URL not set correctly");
  }
  if (
    !process.env.NEXT_PUBLIC_REDIS_TOKEN ||
    process.env.NEXT_PUBLIC_REDIS_TOKEN.length === 0
  ) {
    throw new Error("NEXT_PUBLIC_REDIS_TOKEN not set correctly");
  }

  return {
    url: process.env.NEXT_PUBLIC_REDIS_URL!,
    token: process.env.NEXT_PUBLIC_REDIS_TOKEN!,
  };
}

export const db = new Redis({
  url: getRedisConfig().url,
  token: getRedisConfig().token,
});

// Keys

export const REDIS_GAME_KEY = {
  deck: (roomId: string, username: string) => `room:${roomId}:deck:${username}`,
  currentCard: (roomId: string, username: string) =>
    `room:${roomId}:currentCard:${username}`,
  orderList: (roomId: string) => `room:${roomId}:order`, // this is a list
  playerSet: (roomId: string) => `room:${roomId}:players`, // this is a set
  stateObject: (roomId: string) => `room:${roomId}:state`, // this is an object
  placedCards: (roomId: string) => `room:${roomId}:placedCards`, // this is a list
  playerColor: (roomId: string, username: string) =>
    `room:${roomId}:${username}`,
};
