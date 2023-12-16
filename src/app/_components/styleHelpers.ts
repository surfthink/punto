import { Color } from "../_hooks/GameLogic";

//need to do this because tailwindcss wont know to include the correct css classes otherwise
function numGridColsString(cols: number) {
  switch (cols) {
    case 11:
      return "grid-cols-11";
  }
}

function colorTextStyle(color: Color) {
  switch (color) {
    case Color.BLUE:
      return "text-sky-400";
    case Color.RED:
      return "text-red-400";
    case Color.GREEN:
      return "text-green-400";
    case Color.YELLOW:
      return "text-yellow-400";
  }
}

const StyleHelper = {
  colorTextStyle,
  numGridColsString,
};

export default StyleHelper;
