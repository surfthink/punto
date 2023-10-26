interface PlacedCardProps {
  value: number;
}

export default function PlacedCard({ value }: PlacedCardProps) {
  return (
    <div className="border border-grey-500">
      <p>Card {value}</p>
    </div>
  );
}
