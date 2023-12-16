import {
  GeneralPlayerInfo,
  JoinedEvent,
  PlayerJoinedEvent,
  PuntoEvent,
} from "@/app/_hooks/interfaces";
import { useEffect, useState } from "react";
import { Color } from "./GameLogic";

export function useRoom(
  room: string,
  handleMessage: (e: MessageEvent) => void
) {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    let ignore = false;
    const openConnection = async () => {
      await joinRoom(room);
      if (ignore) return;
      const ws = new WebSocket(
        (process.env.NEXT_PUBLIC_WS_URL as string) + `/join`
      );

      ws.onopen = (event) => {
        console.log("**ONOPEN");
      };
      ws.onmessage = (event) => {
        console.log("**ONMESSAGE");
        handleMessage(event);
      };
      setSocket(ws);
    };

    openConnection();
    return () => {
      ignore = true;
      closeConnection();
    };
  }, []);

  const closeConnection = () => {
    if (socket) {
      console.log("socket exists, closing it");
      socket.close();
      return;
    }
    console.log("no socket to close");
  };

  const joinRoom = async (room: string) => {
    console.log("joining room");
    const res = await fetch(
      (process.env.NEXT_PUBLIC_BACKEND_URL as string) + `/join/${room}`,
      {
        credentials: "include",
        mode: "cors",
      }
    );
    const body = await res.json();
    if (body.message == "room not found") {
    }
  };

  return { socket };
}
