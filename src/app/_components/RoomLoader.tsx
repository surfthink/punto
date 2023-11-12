import { useRoom } from "../_hooks/useRoom";
import RoomInfo from "./RoomInfo";

interface RoomLoaderProps {
  room: string;
}

export default function RoomLoader({ room }: RoomLoaderProps) {
  const { players, color } = useRoom(room);

  return (
    <RoomInfo
      players={players}
      playerId={""}
      playerColor={color}
      roomId={room}
    ></RoomInfo>
  );
}
