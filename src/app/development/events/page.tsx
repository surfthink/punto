"use client";
import EventDrivenPunto, {
  PuntoEvent,
} from "@/app/_components/EventDrivenPunto";
import { Color } from "@/app/_components/GameLogic";
import { useState } from "react";

export default function Page() {
  const [events, setEvents] = useState<PuntoEvent[]>([]);
  const [eventSender, setEventSender] = useState<Color>(Color.RED);

  const [eventXValue, setEventXValue] = useState<number>();
  const [eventYValue, setEventYValue] = useState<number>();
  const [eventValue, setEventValue] = useState<number>();

  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

  function addNewGameEvent() {
    setEvents([
      ...events,
      {
        action: "NEW_GAME",
        data: {
          player: eventSender,
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
            color: eventSender,
            value: eventValue,
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
            color: eventSender,
            value: eventValue,
          },
          x: eventXValue,
          y: eventYValue,
        },
      },
    ]);
    setEventValue(undefined);
  }

  function addNextTurnEvent() {
    setEvents([
      ...events,
      {
        action: "TURN_CHANGED",
        data: {},
      },
    ]);
  }

  function addPlayerJoinedEvent() {
    if (!eventSender) return;
    console.log("adding player joined event");
    setEvents([
      ...events,
      {
        action: "PLAYER_JOINED",
        data: {
          player: eventSender,
        },
      },
    ]);
  }

  function handleCheckbox(i: number, checked: boolean) {
    if (checked) {
      setSelectedEvents([...selectedEvents, i]);
    }
  }

  function removeSelectedEvents() {
    const eventsCopy = [...events];
    let newEvents: PuntoEvent[] = [];
    eventsCopy.filter((event, index) => {
      if (!selectedEvents.includes(index)) newEvents = [...newEvents, event];
    });
    setEvents(newEvents);
  }

  return (
    <main className="flex min-h-screen justify-center w-full p-4">
      <div className="flex flex-col justify-start border h-full w-1/3">
        <h1 className="text-3xl">Event Debugger</h1>
        <label>
          Event Sender
          <select
            name="player"
            onChange={(e) => setEventSender(e.target.value as Color)}
            className="text-black"
            defaultValue={Color.RED}
          >
            <option value={Color.RED}>RED</option>
            <option value={Color.BLUE}>BLUE</option>
            <option value={Color.GREEN}>GREEN</option>
            <option value={Color.YELLOW}>YELLOW</option>
          </select>
        </label>
        <label>Value </label>
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventValue(Number(e.target.value))}
        ></input>
        <label>X </label>
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventXValue(Number(e.target.value))}
        ></input>
        <label>Y</label>
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventYValue(Number(e.target.value))}
        ></input>
        <div className="border flex justify-between flex-wrap">
          <button onClick={addPlayerJoinedEvent}>PLAYER_JOINED</button>
          <button onClick={addNewGameEvent}>NEW_GAME</button>
          <button onClick={addDrawCardEvent}>DRAW_CARD</button>
          <div>
            <button onClick={addPlaceCardEvent}>PLACE_CARD</button>
          </div>

          <button onClick={addNextTurnEvent}>NEXT_TURN</button>
        </div>

        <ul className="border">
          {events.map((e, i) => (
            <li key={i}>
              <input
                type="checkbox"
                value={i}
                onChange={(e) =>
                  handleCheckbox(Number(e.target.value), e.target.checked)
                }
              ></input>
              {e.action} {JSON.stringify(e.data)}
            </li>
          ))}
        </ul>
        <button onClick={removeSelectedEvents}>Remove events</button>
      </div>
      <div className="lg:w-1/2 w-full">
        <EventDrivenPunto events={events} />
      </div>
    </main>
  );
}
