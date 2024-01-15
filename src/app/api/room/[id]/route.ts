import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { getRoomState, joinRoom, roomExists } from "../room";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const roomId = params.id;
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({}, { status: 401, statusText: "Unauthorized" });
  }
  if (!(await roomExists(roomId))) {
    return Response.json({}, { status: 404, statusText: "Not Found" });
  }
  const color = await joinRoom(roomId, session.user.id!);
  const roomState = await getRoomState(roomId);

  //todo let player catch up to already started game

  return Response.json({ color }, { status: 200, statusText: "OK" });
}
