"use client";
import Board from "./board/Board";
import { Card, PlaceDetails } from "../_shared/gameLogic";
import Hand from "./Hand";
import { PlayerInfo } from "../_actions/room";
import { useOptimistic } from "react";
import { PlacedCard, place } from "../_actions/place";
import { useToast } from "@/components/ui/use-toast";
import TurnIndicatorCard from "./cards/TurnIndicatorCard";

export default function GameInterface(props: {
  board?: PlaceDetails[][];
  player?: string;
  players?: PlayerInfo[];
  turn?: string;
  card?: Card;
  debug?: boolean;
  className?: string;
}) {
  const { toast } = useToast();

  const [optimisticBoard, addOptimisticCard] = useOptimistic(
    props.board,
    (state, newCard: PlacedCard) => {
      const newBoard = [...(state || [])];
      newBoard[newCard.y][newCard.x] = {
        card: { color: newCard.c, value: newCard.v },
      } as PlaceDetails;
      return newBoard;
    }
  );

  const [optimisticCard, blankCard] = useOptimistic(
    props.card,
    (state, newCard: undefined) => newCard
  );

  async function formAction(formData: FormData) {
    if (!props.card) return;
    if (!props.board) return;
    if (String(props.player) !== String(props.turn)) {
      toast({
        title: "Sneaky! You cannot play out of turn.",
        description: `It is currently ${props.turn}'s turn. You are ${props.player}.`,
      });
      return;
    }
    const { x, y } = JSON.parse(formData.get("position") as string);
    if (props.board[y][x].state !== "open") {
      toast({
        title: "You cannot play that card there!",
        description: `That space is closed.`,
      });
      return;
    }
    if (
      props.board[y][x].card &&
      props.board[y][x].card!.color === props.card.color
    ) {
      toast({
        title: "You cannot play that card there!",
        description: `That cards color is the same as yours.`,
      });
      return;
    }
    if (
      props.board[y][x].card &&
      props.board[y][x].card!.value >= props.card.value
    ) {
      toast({
        title: "You cannot play that card there!",
        description: `You can only play on top of cards with a lower value.`,
      });
      return;
    }
    addOptimisticCard({ c: props.card.color, v: props.card.value, x, y });
    blankCard(undefined);
    await place(x, y);
  }

  return (
    <div className="grid h-full max-h-[100vh] ">
        <Board
          formAction={formAction}
          board={optimisticBoard}
          debug={props.debug || false}
          card={optimisticCard}
          
        ></Board>
      <div className="border w-full flex items-center justify-center">
        <Hand card={optimisticCard}></Hand>
      </div>
      <div className="flex items-center justify-center border w-full">
        {props.players &&
          props.players.length > 0 &&
          //make this responsive
          props.players.map((player, index) => (
            <TurnIndicatorCard
              key={player.username}
              player={player}
              index={index}
              username={props.player || ""}
              turn={props.turn || ""}
            ></TurnIndicatorCard>
          ))}
      </div>
    </div>
  );
}
