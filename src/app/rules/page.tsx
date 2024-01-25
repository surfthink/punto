export default function Page() {
  return (
    <div className="md:w-2/3 lg:w-1/2">
      <h1 className="text-2xl">Rules</h1>
      <h2 className="text-xl">Goal</h2>
      <p>Get 4 of your cards in a line. (horizontal, vertical, or diagonal)</p>
      <h2 className="text-xl">How to play</h2>
      <p>
        Each turn you will draw a single card from the deck. You must place this
        on:
      </p>
      <ul>
        <li>Any open space adjacent to an existing card</li>
        <li>Over the top of any other card with a lower number of dots </li>
      </ul>
      <p>
        Once you have placed your card, your turn is over and the next player
        goes. The game works best with four players but you can play with fewer.
      </p>
    </div>
  );
}
