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
