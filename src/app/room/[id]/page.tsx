import { getRoomState} from "@/app/_actions/gameState";
import { Lobby } from "@/app/_components/Lobby";
import MultiplayerPunto from "@/app/_components/MultiplayerPunto";
import { RoomState } from "@/app/_shared/gameLogic";

export default async function Page({ params }: { params: { id: string } }) {
  const roomState = await getRoomState(params.id);

  if (roomState === RoomState.WAITING)
    return <Lobby roomId={params.id}></Lobby>;
  if (roomState === RoomState.PLAYING || roomState === RoomState.FINISHED)
    return (
      <MultiplayerPunto
        roomId={params.id}
        roomState={roomState}
      ></MultiplayerPunto>
    );

  return <>Room not found</>;
}
