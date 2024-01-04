import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { db } from "../../db/redis";
import { roomExists } from "../room";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const roomId = params.id;
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({}, { status: 401, statusText: "Unauthorized" });
  }
  if (await roomExists(roomId)) {
    return Response.json({}, { status: 200, statusText: "OK" });
  }
  return Response.json({}, { status: 404, statusText: "Not Found" });
}
