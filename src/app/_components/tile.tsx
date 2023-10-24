interface TileProps {
  value: number;
}

export default function Tile({ value }: TileProps) {
  return (
    <div className="border border-grey-500">
      <p>Tile {value}</p>
    </div>
  );
}
