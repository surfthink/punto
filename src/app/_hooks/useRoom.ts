import {
  GeneralPlayerInfo,
  JoinedEvent,
  PlayerJoinedEvent,
  PuntoEvent,
} from "@/app/_hooks/interfaces";
import { useEffect, useState } from "react";
import { Color } from "../_components/GameLogic";

export function useRoom(room?: string, channelId?: string) {
  const [players, setPlayers] = useState<GeneralPlayerInfo[]>();
  const [id, setId] = useState<string>();
  const [color, setColor] = useState<Color>();

  useEffect(() => {
    // no room id passed yet
    console.log("useEffect is running with: ", room);
    if (!room || !channelId) return;
    const ws = new WebSocket(
      (process.env.NEXT_PUBLIC_WS_URL as string) + `/join`,
      "json"
    );

    //it seems this is the best way to set which room I want to join...
    document.cookie = `roomId=${room}; SameSite=None; Secure`;
    document.cookie = `channelId=${channelId}; SameSite=None; Secure`;

    ws.onopen = (event) => {
      console.log("**ONOPEN");
    };
    ws.onmessage = (event) => {
      console.log("**ONMESSAGE");
      receiveMessage(event);
    };

    return () => {
      ws.close();
    };
  }, [room]);

  const receiveMessage = (event: MessageEvent) => {
    console.log("**RECEIVEMESSAGE");
    const body = JSON.parse(event.data) as PuntoEvent<unknown>;
    console.log("server message: ", body);

    if (body.eventType === "JOINED") {
      const e = body as JoinedEvent;
      setId(e.data.playerId);
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

  return { players, color };
}
