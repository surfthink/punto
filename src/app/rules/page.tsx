export default function Page() {
  return (
    <>
    <h1 className="text-3xl">Rules</h1>
    <h2 className="text-2xl">How to play</h2>
    <p>
      Each turn you will draw a single card from the deck. You must place this
      on:
    </p>
    <ul className="list-disc list-inside text-left">
      <li>Any open space adjacent to an existing card</li>
      <li>Over the top of any other card with a lower number of dots </li>
    </ul>
    <p>
      Once you have placed your card, your turn is over and the next player
      goes. The game works best with four players but you can play with fewer.
    </p>
    <h2 className="text-xl">Goal</h2>
    <p>Get four of your cards in a line (horizontal, vertical, or diagonal).</p>
    </>
  );
}
