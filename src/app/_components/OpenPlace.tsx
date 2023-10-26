import { MouseEventHandler } from "react";

interface OpenPlaceProps {
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function OpenPlace({ onClick }: OpenPlaceProps) {
  return (
    <div className="border bg-red-800 hover:bg-red-600" onClick={onClick}>
      <p className="bg-red-800 hover:bg-red-600"></p>
    </div>
  );
}
