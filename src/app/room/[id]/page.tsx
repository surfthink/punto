import { getRoomState } from "@/app/_actions/gameState";
import { Lobby } from "@/app/_components/Lobby";
import { RoomState } from "@/app/_shared/gameLogic";

export default async function Page({ params }: { params: { id: string } }) {
  const roomState = await getRoomState(params.id);
  if (roomState === RoomState.WAITING)
    return <Lobby roomId={params.id}></Lobby>;
  if (roomState === RoomState.PLAYING) return <>Playing</>;
  if (roomState === RoomState.FINISHED) return <>Finished</>;
  return <>Room not found</>;
}
