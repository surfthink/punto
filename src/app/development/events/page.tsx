"use client";
import EventDrivenPunto, {
  PuntoEvent,
} from "@/app/_components/EventDrivenPunto";
import { Color } from "@/app/_components/GameLogic";
import { useState } from "react";

export default function Page() {
  const [events, setEvents] = useState<PuntoEvent[]>([]);

  function addNewGame() {
    setEvents([
      ...events,
      {
        action: "NEW_GAME",
        data: {
          player: Color.RED,
          players: [Color.RED, Color.BLUE],
        },
      },
    ]);
  }
  return (
    <main className="flex min-h-screen items-center justify-center w-full p-4">
      <div className="flex flex-col justify-between">
        <button onClick={addNewGame}>NEW GAME</button>
        <ul>
          {events.map((e, i) => (
            <li key={i}>
              {e.action} {JSON.stringify(e.data)}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:w-1/2 w-full">
        <EventDrivenPunto events={events} />
      </div>
    </main>
  );
}
