import { getServerSession } from "next-auth";
import { joinRoom } from "../room";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const roomId = params.id;
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({}, { status: 401, statusText: "Unauthorized" });
  }
  try {
    await joinRoom(roomId, session.user!.id!);
  } catch (e) {
    return Response.json({}, { status: 400 });
  }
  return Response.json({}, { status: 200, statusText: "OK" });
}
