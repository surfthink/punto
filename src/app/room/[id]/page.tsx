import { getRoomState } from "@/app/_actions/gameState";
import { Lobby } from "@/app/_components/Lobby";
import MultiplayerPunto from "@/app/_components/MultiplayerPunto";
import { RoomState } from "@/app/_shared/gameLogic";

export default async function Page({ params }: { params: { id: string } }) {
  const roomState = await getRoomState(params.id);
  if (roomState === RoomState.WAITING)
    return <Lobby roomId={params.id}></Lobby>;
  if (roomState === RoomState.PLAYING)
    return <MultiplayerPunto roomId={params.id}></MultiplayerPunto>;
  if (roomState === RoomState.FINISHED)
    return <>Game is finished... join another room.</>;
  return <>Room not found</>;
}
