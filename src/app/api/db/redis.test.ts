import { redis } from "./redis";

describe("Redis Tests", () => {
  beforeEach(async () => {
    // Clear the Redis database before each test
    await redis.flushall();
  }, 5000);

  it("should add a count value to the Redis database and check its value", async () => {
    const key = "count";
    const value = 10;

    // Add the count value to the Redis database
    await redis.set(key, value);

    // Get the count value from the Redis database
    const result = await redis.get(key);

    // Assert that the count value is equal to the expected value
    expect(result).toBe(value);
  }, 5000);
});
