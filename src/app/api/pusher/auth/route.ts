import { getServerSession } from "next-auth";
import { pusher } from "../pusher";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function POST(request: Request) {
  const form = await request.formData();
  const socketId = form.get("socket_id")! as string;
  const channel = form.get("channel_name")! as string;
  const session = await getServerSession(authOptions);

  const presenceData = {
    user_id: session?.user?.id!,
    user_info: session?.user,
  };
  // This authenticates every user. Don't do this in production!
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  return Response.json(authResponse);
}
