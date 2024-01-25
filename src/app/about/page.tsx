import Link from "next/link";

export default function Page() {
  return (
    <div className="md:w-2/3 lg:w-1/2">
      <h1 className="text-2xl">About</h1>
      <p>
        An online version of a table top game I was shown by some dutch friends
        while traveling. I decided it would be the perfect project to explore
        using web sockets with Next JS. Check out the actual{" "}
        <Link href="https://www.bernhardweber.de/punto.html">
          <b className="hover:underline">board game</b>
        </Link>{" "}
        by Bernhard Weber!
      </p>
      <p>
        The source code of this project can be found on my{" "}
        <Link href="https://github.com/BB-33/punto">
          <b className="hover:underline">Github</b>
        </Link>{" "}
      </p>
    </div>
  );
}
