import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold underline">Punto Online</h1>
      <p>
        An online version of the dutch table top game. I was shown it by some
        friends while traveling and decided it would be the perfect project to
        explore using web sockets with Next JS. Check out the actual{" "}
        <Link href="https://www.bernhardweber.de/punto.html">
          <b className="hover:underline">board game</b>
        </Link>{" "}
        by Bernhard Weber!
      </p>
      <Link href="/game">
        <h2 className="text-2xl font-bold hover:underline">Play</h2>
      </Link>
    </main>
  );
}
