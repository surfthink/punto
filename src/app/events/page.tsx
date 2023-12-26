"use client";
import EventDrivenPunto from "@/app/events/EventDrivenPunto";
import { Color } from "@/app/_shared/gameLogic";
import { useState } from "react";
import {
  DrewCardEvent,
  NewGameEvent,
  PlacedCardEvent,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  PuntoEvent,
  TurnChangedEvent,
} from "@/app/events/gameEvents";

export default function Page() {
  const [events, setEvents] = useState<PuntoEvent<unknown>[]>([]);

  const [eventSender, setEventSender] = useState<Color>(Color.RED);
  const [eventXValue, setEventXValue] = useState<number>();
  const [eventYValue, setEventYValue] = useState<number>();
  const [eventCardValue, setEventCardValue] = useState<number>();
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

  function addNewGameEvent() {
    setEvents([
      ...events,
      {
        action: "NEW_GAME",
        data: {
          player: {
            color: eventSender,
            id: eventSender,
          },
        },
      } as NewGameEvent,
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
            value: eventCardValue,
          },
        },
      } as DrewCardEvent,
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
            value: eventCardValue,
          },
          x: eventXValue,
          y: eventYValue,
        },
      } as PlacedCardEvent,
    ]);
    setEventCardValue(undefined);
  }

  function addNextTurnEvent() {
    setEvents([
      ...events,
      {
        action: "TURN_CHANGED",
        data: {},
      } as TurnChangedEvent,
    ]);
  }

  function addPlayerJoinedEvent() {
    if (!eventSender) return;
    console.log("adding player joined event!");
    setEvents([
      ...events,
      {
        action: "PLAYER_JOINED",
        data: {
          player: {
            color: eventSender,
            id: eventSender,
          },
        },
      } as PlayerJoinedEvent,
    ]);
  }

  function addPlayerLeftEvent() {
    if (!eventSender) return;
    console.log("adding player left event");
    setEvents([
      ...events,
      {
        action: "PLAYER_LEFT",
        data: {
          player: {
            color: eventSender,
            id: eventSender,
          },
        },
      } as PlayerLeftEvent,
    ]);
  }

  function handleCheckbox(i: number, checked: boolean) {
    if (checked) {
      setSelectedEvents([...selectedEvents, i]);
    }
  }

  function removeSelectedEvents() {
    const eventsCopy = [...events];
    let newEvents: PuntoEvent<unknown>[] = [];
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
        <label>Card Value</label>
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventCardValue(Number(e.target.value))}
        ></input>
        <label>X Value</label>
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventXValue(Number(e.target.value))}
        ></input>
        <label>Y Value</label>
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventYValue(Number(e.target.value))}
        ></input>
        <div className="border flex justify-between flex-wrap">
          <button onClick={addPlayerJoinedEvent}>PLAYER_JOINED</button>
          <button onClick={addPlayerLeftEvent}>PLAYER_LEFT</button>
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
