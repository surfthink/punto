"use client";
import EventDrivenPunto, {
  PuntoEvent,
} from "@/app/_components/EventDrivenPunto";
import { Color } from "@/app/_components/GameLogic";
import { useState } from "react";

export default function Page() {
  const [events, setEvents] = useState<PuntoEvent[]>([]);

  function addNewGameEvent() {
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

  function addDrawCardEvent() {
    setEvents([
      ...events,
      {
        action: "DRAW_CARD",
        data: {
          card: {
            color: Color.RED,
            value: 1,
          },
        },
      },
    ]);
  }

  function addPlaceCardEvent() {
    setEvents([
      ...events,
      {
        action: "CARD_PLACED",
        data: {
          card: {
            color: Color.RED,
            value: 1,
          },
          x: 5,
          y: 5,
        },
      },
    ]);
  }

  function addNextTurnEvent() {
    setEvents([
      ...events,
      {
        action: "TURN_CHANGED",
        data: {
          turn: Color.BLUE,
        },
      },
    ]);
  }

  return (
    <main className="flex min-h-screen justify-center w-full p-4">
      <div className="flex flex-col justify-start border h-full w-1/3">
        <h1 className="text-3xl">Event Debugger</h1>
        <div className="border flex justify-between">
          <button onClick={addNewGameEvent}>NEW GAME</button>
          <button onClick={addDrawCardEvent}>DRAW CARD</button>
          <button onClick={addPlaceCardEvent}>PLACE CARD</button>
          <button onClick={addNextTurnEvent}>NEXT TURN</button>
        </div>

        <ul className="border">
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
