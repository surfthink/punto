"use client";
import RoomLoader from "@/app/room/RoomLoader";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <RoomLoader room={params.id}></RoomLoader>
    </>
  );
}
