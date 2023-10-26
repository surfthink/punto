import { MouseEventHandler } from "react";

interface OpenPlaceProps {
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function OpenPlace({ onClick }: OpenPlaceProps) {
  return (
    <div className="border border-gray-500" onClick={onClick}>
      <p className="bg-red-800 hover:bg-red-600">Open</p>
    </div>
  );
}
