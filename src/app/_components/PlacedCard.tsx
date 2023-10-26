import { Color } from "./Punto";

interface PlacedCardProps {
  value: number;
  color: Color;
}

export default function PlacedCard({ value, color }: PlacedCardProps) {
  return (
    <div className="border border-grey-500">
      <p className="text-xl text-sky-500">{value}</p>
    </div>
  );
}
