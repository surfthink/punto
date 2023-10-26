import { MouseEventHandler } from "react";

interface OpenPlaceProps {
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function OpenPlace({ onClick }: OpenPlaceProps) {
  return (
    <div className="border border-grey-500 bg-red-100" onClick={onClick}>
      <p className="bg-red-200 hover:bg-blue-400">Open</p>
    </div>
  );
}
