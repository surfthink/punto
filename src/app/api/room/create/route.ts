import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createRoom, randomUniqueCode } from "../room";

export async function GET() {
  const id = await randomUniqueCode(4);
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({}, { status: 401, statusText: "Unauthorized" });
  }
  await createRoom(id);
  return Response.json({ id });
}
