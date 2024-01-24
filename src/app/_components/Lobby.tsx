"use client";
import PlayerRoomCard from "@/app/_components/cards/PlayerRoomCard";
import useRoomChannel from "@/app/_hooks/useRoomChannel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SetUsernameDialog } from "./dialog/SetUsernameDialog";
import { start } from "../_actions/gameState";
import { useEffect } from "react";
import InviteLinkCard from "./cards/InviteLinkCard";
import { Color } from "../_shared/gameLogic";
import { Skeleton } from "@/components/ui/skeleton";

export function Lobby(props: { roomId: string }) {
  const { channel, members, reconnect } = useRoomChannel(props.roomId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!members) return;
    await start(
      props.roomId,
      members?.map((member) => member.username)
    );
  }

  return (
    <>
      <SetUsernameDialog
        roomId={props.roomId}
        onChange={reconnect}
      ></SetUsernameDialog>
      <Card>
        <CardHeader>
          <CardTitle>{props.roomId}</CardTitle>
          <CardDescription>
            ...Waiting for players to join the room...
          </CardDescription>
        </CardHeader>
        <LobbyContent members={members}></LobbyContent>
        <CardFooter>
          <form onSubmit={handleSubmit}>
            <Button type="submit">Start Game</Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}

function LobbyContent(props: {
  members?: { username: string; color: Color }[];
}) {
  if (!props.members) {
    return (
      <CardContent className="grid gap-3 grid-cols-2 grid-rows-2 h-48">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-full"></Skeleton>
          ))}
      </CardContent>
    );
  }
  return (
    <CardContent className="grid gap-3 grid-cols-2 grid-rows-2 h-48">
      {props.members.map((member) => (
        <PlayerRoomCard
          key={member.username}
          color={member.color}
          username={member.username}
        ></PlayerRoomCard>
      ))}
      {props.members &&
        props.members.length < 4 &&
        Array(4 - props.members.length)
          .fill(null)
          .map((_, i) => <InviteLinkCard key={i}></InviteLinkCard>)}
    </CardContent>
  );
}
