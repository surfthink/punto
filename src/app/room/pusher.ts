import Pusher from "pusher-js";

export const pusher = new Pusher("50305a23758f15733e2d", {
  // need to make env var
  cluster: "ap1",
  authEndpoint: "/api/pusher/auth", // different from docs? https://pusher.com/docs/channels/server_api/authorizing-users/
});
