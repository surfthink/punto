"use client";
import { signIn, signOut } from "next-auth/react";

export function Login() {
  return <button onClick={() => signIn()}>Login</button>;
}

export function Logout() {
  return <button onClick={() => signOut()}>Logout</button>;
}
