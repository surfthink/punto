import { MouseEventHandler } from "react";

interface OpenPlaceProps {
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function OpenPlace({ onClick }: OpenPlaceProps) {
  return (
    <div
      className="border border-blue-800 hover:bg-blue-900 aspect-square"
      onClick={onClick}
    ></div>
  );
}
