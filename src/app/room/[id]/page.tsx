"use client";
import RoomLoader from "@/app/_components/RoomLoader";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <RoomLoader room={params.id}></RoomLoader>
    </>
  );
}
