import { getPlayerColors } from "../../room";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const playerColors = await getPlayerColors(params.id);
  return Response.json({ playerColors }, { status: 200, statusText: "OK" });
}
