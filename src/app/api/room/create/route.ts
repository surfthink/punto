import { getServerSession } from "next-auth";
import { createRoom, randomUniqueCode } from "../room";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({}, { status: 401, statusText: "Unauthorized" });
  }
  const id = await randomUniqueCode(4);
  await createRoom(id);
  return Response.json({ id });
}
