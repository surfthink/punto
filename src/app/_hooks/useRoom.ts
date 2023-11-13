import {
  GeneralPlayerInfo,
  JoinedEvent,
  PlayerJoinedEvent,
  PuntoEvent,
} from "@/app/_hooks/interfaces";
import { useEffect, useState } from "react";
import { Color } from "../_components/GameLogic";
import { getCookie } from "cookies-next";
import { browser } from "process";

export function useRoom(room: string) {
  const [players, setPlayers] = useState<GeneralPlayerInfo[]>();
  const [color, setColor] = useState<Color>();
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    let ignore = false;
    const openConnection = async () => {
      await joinRoom(room);
      if (ignore) return;
      const ws = new WebSocket(
        (process.env.NEXT_PUBLIC_WS_URL as string) + `/join`,
        "json"
      );

      ws.onopen = (event) => {
        console.log("**ONOPEN");
      };
      ws.onmessage = (event) => {
        console.log("**ONMESSAGE");
        receiveMessage(event);
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
    console.log(body.message);
  };

  const receiveMessage = (event: MessageEvent) => {
    console.log("**RECEIVEMESSAGE");
    const body = JSON.parse(event.data) as PuntoEvent<unknown>;
    console.log("server message: ", body);

    if (body.eventType === "JOINED") {
      const e = body as JoinedEvent;
      setPlayers(e.data.players);
      setColor(e.data.players.find((p) => p.id === e.data.playerId)?.color);
    }
    if (body.eventType === "PLAYER_JOINED") {
      setPlayers((body as PlayerJoinedEvent).data.players);
    }
    if (body.eventType === "PLAYER_LEFT") {
      setPlayers((body as PlayerJoinedEvent).data.players);
    }
  };

  return { players, color, socket };
}
