import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { Login, Logout } from "./LoginOrOut";

export async function UserDetails() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return (
    <div>
      <p>Signed in as {session!.user!.email}</p>
      <img src={session!.user!.image!} />
    </div>
  );
}

export async function LoginOrOut() {
  const session = await getServerSession(authOptions);
  if (!session) return <Login />;
  return (
    <div>
      <UserDetails />
      <Logout />
    </div>
  );
}

export function Authentication() {
  return <LoginOrOut />;
}
