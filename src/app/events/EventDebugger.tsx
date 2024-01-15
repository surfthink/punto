import { useState } from "react";
import {
  DrewCardEvent,
  NewGameEvent,
  PlacedCardEvent,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  PuntoEvent,
  TurnChangedEvent,
} from "./gameEvents";
import { Color } from "../_shared/gameLogic";

interface EventDebuggerProps {
  events: PuntoEvent<unknown>[];
  setEvents: (events: PuntoEvent<unknown>[]) => void;
}

export default function EventDebugger({
  events,
  setEvents,
}: EventDebuggerProps) {
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
        data: {},
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
    <>
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
      <label>
        Card Value:
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventCardValue(Number(e.target.value))}
        ></input>
      </label>
      <label>
        X Value:
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventXValue(Number(e.target.value))}
        ></input>
      </label>
      <label>
        Y Value:
        <input
          className="text-black"
          type="text"
          onChange={(e) => setEventYValue(Number(e.target.value))}
        ></input>
      </label>
      <div className="border flex justify-between flex-wrap">
        <button onClick={addPlayerJoinedEvent}>PLAYER_JOINED</button>
        <button onClick={addPlayerLeftEvent}>PLAYER_LEFT</button>
        <button onClick={addNewGameEvent}>NEW_GAME</button>
        <button onClick={addDrawCardEvent}>DRAW_CARD</button>
        <button onClick={addPlaceCardEvent}>PLACE_CARD</button>
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
    </>
  );
}
