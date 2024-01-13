import { getServerSession } from "next-auth";
import { roomExists } from "../../room";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { DrewCardEvent } from "@/app/events/gameEvents";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const roomId = params.id;
  const session = await getServerSession(authOptions);
  //check that user is in the room
  if (!session) {
    return Response.json({}, { status: 401, statusText: "Unauthorized" });
  }
  if (await !roomExists(roomId)) {
    return Response.json({}, { status: 404, statusText: "Not Found" });
  }
  //TODO: store deck state in the database and draw from there
  return Response.json({ cardValue: 1 }, { status: 200, statusText: "OK" });
}
