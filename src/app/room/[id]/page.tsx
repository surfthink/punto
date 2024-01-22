"use client";
import { Lobby } from "@/app/_components/Lobby";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <Lobby roomId={params.id}></Lobby>
    </>
  );
}
