"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    (async () => {
      console.log("sending request to", process.env.NEXT_PUBLIC_BACKEND_URL);
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL as string);
      const body = await res.json();
      console.log(body);
      console.log("silly");
    })();

    // const ws = new WebSocket(process.env.BACKEND_URL as string);

    // ws.onopen = () => {
    //   console.log("**ON OPEN");
    //   ws.send("This is coming from the client!");
    // };
  }, []);

  return (
    <>
      <h1>Testing bun backend</h1>
    </>
  );
}
