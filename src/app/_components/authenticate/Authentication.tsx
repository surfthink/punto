"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

export function Login() {
  return <button onClick={() => signIn()}>Login</button>;
}

export function Logout() {
  return <button onClick={() => signOut()}>Logout</button>;
}

export function UserDetails() {
  const { data: session } = useSession();
  if (!session) return null;
  return (
    <div>
      <p>Signed in as {session!.user!.email}</p>
      <img src={session!.user!.image!} />
    </div>
  );
}

export function LoginOrOut() {
  const { data: session } = useSession();
  if (!session) return <Login />;
  return (
    <div>
      <UserDetails />
      <Logout />
    </div>
  );
}

export function Authentication() {
  return (
    <SessionProvider>
      <LoginOrOut />
    </SessionProvider>
  );
}
