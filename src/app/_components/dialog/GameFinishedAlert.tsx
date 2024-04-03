"use client";
import { PlaceDetails, RoomState } from "@/app/_shared/gameLogic";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import Board from "../board/Board";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

export function GameFinishedAlert(props: {
  roomState: RoomState;
  winner: string | null;
  board?: PlaceDetails[][];
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (props.roomState === RoomState.FINISHED) {
      setOpen(true);
    }
  }, [props.roomState]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {props.winner} is the winner!
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Card>
          <Board board={props.board} interactive={false}></Board>
        </Card>
        <AlertDialogFooter>
        <AlertDialogAction onClick={() => router.push("/")}>
          Start Next Round
        </AlertDialogAction>
          <AlertDialogCancel  onClick={() => router.push("/")}>
            Exit Room
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
