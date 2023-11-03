import { Color } from "./GameLogic";

//need to do this because tailwindcss wont know to include the correct css classes otherwise
function numGridColsString(cols: number) {
  switch (cols) {
    case 11:
      return "grid-cols-11";
  }
}

function colorTextStyle(color: Color) {
  switch (color) {
    case "blue":
      return "text-sky-400";
    case "red":
      return "text-red-400";
    case "green":
      return "text-green-400";
    case "yellow":
      return "text-yellow-400";
  }
}

const StyleHelper = {
  colorTextStyle,
  numGridColsString,
};

export default StyleHelper;
