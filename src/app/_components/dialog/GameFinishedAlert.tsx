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
        <Board board={props.board}></Board>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/")}>
            Home
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
