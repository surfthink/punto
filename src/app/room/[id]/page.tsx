"use client";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/room/${params.id}`);
      const body = await res.json();
      console.log(body);
    })();
  }, []);

  return (
    <>
      <h1>Room {params.id}</h1>
    </>
  );
}
