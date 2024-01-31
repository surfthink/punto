import { place } from "./place";

export function handlePlacement(x: number, y: number) {
  return async () => {
    "use server";
    try {
      await place(x, y);
    } catch (e) {
      console.log(e);
    }
  };
}
