import Tile from "./tile";

interface GridProps {
  cols: number;
}

export default function Grid({ cols }: GridProps) {
  const tiles: number[] = [];

  for (let i = 1; i <= cols * cols; i++) {
    tiles.push(i);
  }

  //need to do this because tailwindcss wont know to include the correct css classes otherwise

  return (
    <div className={`grid ${numGridColsString(cols)} gap-4 w-full`}>
      {tiles.map((tile, i) => (
        <Tile value={tile} key={i} />
      ))}
    </div>
  );
}

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
    case 5:
      return "grid-cols-5";
    case 6:
      return "grid-cols-6";
  }
}
