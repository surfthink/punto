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
  deck: (roomId: string, username: string) => `room:deck:${roomId}:${username}`,
  currentCard: (roomId: string, username: string) =>
    `room:currentCard:${roomId}:${username}`,
  orderList: (roomId: string) => `room:order:${roomId}`, // this is a list
  playerSet: (roomId: string) => `room:players:${roomId}`, // this is a set
  stateObject: (roomId: string) => `room:state:${roomId}`, // this is an object
  placedCards: (roomId: string) => `room:placedCards:${roomId}`, // this is a list
  playerColor: (roomId: string, username: string) =>
    `room:${roomId}:${username}`,
};
