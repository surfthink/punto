import { Color } from "./Punto";

interface HandProps {
  //needs to be told the card information
  color: Color;
  value: number;
}

export default function Hand({ color, value }: HandProps) {
  return (
    <div className="border">
      <p>Players Hand</p>
      <p className="text-sky-400">{color}</p>
      <h1 className="text-sky-400 text-lg">{value}</h1>
    </div>
  );
}
