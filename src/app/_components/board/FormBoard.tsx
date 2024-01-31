import { Button } from "@/components/ui/button";

export default function FormBoard() {
  const board: number[][] = Array(11).fill(Array(11).fill(0));

  function handlePlacement(x: number, y: number) {
    return async () => {
      "use server";
      console.log(x, y);
    };
  }

  return (
    <form className="grid grid-cols-11">
      {board.map((row, y) =>
        row.map((col, x) => (
          <Button
            key={`x:${x} y:${y}`}
            formAction={handlePlacement(x, y)}
            className="aspect-square"
          >
            {x},{y}
          </Button>
        ))
      )}
    </form>
  );
}
