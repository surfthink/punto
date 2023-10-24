import Grid from "./_components/grid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold underline">Punto</h1>
      <Grid cols={2} />
    </main>
  );
}
