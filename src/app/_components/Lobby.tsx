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
import { startAction } from "../_actions/gameState";

export function Lobby(props: { roomId: string }) {
  const { channel, members, reconnect } = useRoomChannel(props.roomId);
  const start = startAction.bind(null, props.roomId);

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
        <CardContent className="grid gap-3 grid-cols-2 grid-rows-2">
          {members?.map((member) => (
            <PlayerRoomCard
              key={member.username}
              color={member.color}
              username={member.username}
            ></PlayerRoomCard>
          ))}
          {members &&
            members?.length < 4 &&
            Array(4 - members.length)
              .fill(null)
              .map((_, i) => <PlayerRoomCard key={i}></PlayerRoomCard>)}
        </CardContent>
        <CardFooter>
          <form action={start}>
            <Button type="submit">Start Game</Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
