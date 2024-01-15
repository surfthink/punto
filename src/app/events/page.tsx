"use client";
import EventDrivenPunto from "@/app/events/EventDrivenPunto";
import { useState } from "react";
import { PuntoEvent } from "@/app/events/gameEvents";
import EventDebugger from "./EventDebugger";

export default function Page() {
  const [events, setEvents] = useState<PuntoEvent<unknown>[]>([]);

  function handlePlacement(x: number, y: number) {
    console.log("handlePlacement");
    return () => {
      console.log(`handlePlacement ${x} ${y}`);
    };
  }

  return (
    <main className="flex min-h-screen justify-center w-full p-4">
      <div className="flex flex-col justify-start border h-full w-1/3">
        <EventDebugger events={events} setEvents={setEvents} />
      </div>
      <div className="lg:w-1/2 w-full">
        {/* <EventDrivenPunto events={events} handlePlacement={handlePlacement} /> */}
      </div>
    </main>
  );
}
