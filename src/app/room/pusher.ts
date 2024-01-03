import Pusher from "pusher-js";

export const pusher = new Pusher(process.env.PUSHER_KEY!, {
  // need to make env var
  cluster: process.env.PUSHER_CLUSTER!,
  authEndpoint: "/api/pusher/auth", // different from docs? https://pusher.com/docs/channels/server_api/authorizing-users/
});
