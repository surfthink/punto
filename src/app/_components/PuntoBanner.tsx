export default function PuntoBanner() {
  return (
    <h1 className="bg-black rounded-lg aspect-square text-5xl p-2 flex flex-col items-center justify-center gap-1">
      <div className="flex items-center justify-center">
        <span className="text-red-500">p</span>
        <span className="text-blue-500">u</span>
        <span className="text-yellow-500">n</span>
        <span className="text-green-500">t</span>
        <span className="text-red-500">o</span>
      </div>{" "}
      <b className="text-white">ONLINE</b>
    </h1>
  );
}
