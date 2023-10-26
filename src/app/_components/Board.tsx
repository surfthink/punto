"use client";

import { MouseEventHandler } from "react";
import ClosedPlace from "./ClosedPlace";
import OpenPlace from "./OpenPlace";
import PlacedCard from "./PlacedCard";
import { Color, PlaceDetails } from "./Punto";

interface BoardProps {
  board: PlaceDetails[][];
  handlePlacement: (
    xpos: number,
    ypos: number
  ) => MouseEventHandler<HTMLDivElement>; //it would be nice to have this function take in placement information
}

export default function Board({ board, handlePlacement }: BoardProps) {
  return (
    <div className={`grid ${numGridColsString(board[0].length)} w-full`}>
      {board.map((row, i) =>
        row.map((place, j) => {
          if (place.state == "filled" && place.value && place.color) {
            return (
              <PlacedCard
                value={place.value}
                color={place.color}
                key={`x:${j} y:${i}`}
              />
            );
          }
          if (place.state == "open") {
            return (
              <OpenPlace
                key={`x:${j} y:${i}`}
                onClick={handlePlacement(j, i)}
              />
            );
          }
          if (place.state == "closed") {
            return <ClosedPlace key={`x:${j} y:${i}`} />;
          }
        })
      )}
    </div>
  );
}

//need to do this because tailwindcss wont know to include the correct css classes otherwise
function numGridColsString(cols: number) {
  switch (cols) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-4";
    case 11:
      return "grid-cols-11";
    case 12:
      return "grid-cols-12";
  }
}
