"use client";
import PlayerRoomCard from "@/app/_components/cards/PlayerRoomCard";
import useRoomChannel from "@/app/_hooks/useRoomChannel";
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
import { useEffect, useState } from "react";
import InviteLinkCard from "./cards/InviteLinkCard";
import { Color } from "../_shared/gameLogic";
import { Skeleton } from "@/components/ui/skeleton";
import FormButton from "./FormButton";

export function Lobby(props: { roomId: string }) {
  const { members, reconnect } = useRoomChannel(props.roomId);
  const [formAction, setFormAction] = useState<(formData: FormData) => void>();

  useEffect(() => {
    if (!members) return;
    const action = start.bind(
      null,
      props.roomId,
      members.map((m) => m.username)
    );
    setFormAction(() => action);
  }, [members]);

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
          <form action={formAction}>
            <FormButton type="submit">Start Game</FormButton>
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
