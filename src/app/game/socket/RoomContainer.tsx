import { PropsWithChildren, useEffect } from "react";

interface RoomContainerProps {
  roomId?: string;
}

export default function RoomContainer({
  roomId,
  children,
}: PropsWithChildren<RoomContainerProps>) {
  useEffect(() => {}, []);

  return <>{children}</>;
}
