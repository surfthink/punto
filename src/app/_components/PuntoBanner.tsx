import { cn } from "@/lib/utils";

export default function PuntoBanner({className,showOnline = false}:{className?:string,showOnline?:boolean}) {
  return (
    <h1 className={cn("bg-black rounded-lg aspect-squareflex flex-col items-center justify-center",className)}>
      <div className="flex items-center justify-center">
        <span className="text-red-500">p</span>
        <span className="text-blue-500">u</span>
        <span className="text-yellow-500">n</span>
        <span className="text-green-500">t</span>
        <span className="text-red-500">o</span>
      </div>{" "}
      {showOnline && <b className="text-white">ONLINE</b>}
    </h1>
  );
}
