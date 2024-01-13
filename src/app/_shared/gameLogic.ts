export enum Color {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
}

export interface Card {
  value: number;
  color: Color;
}
/**
 * holds the game state
 */
export interface PlaceDetails {
  state: "open" | "closed";
  card?: Card;
}

export type BoardState = PlaceDetails[][];

type Deck = Card[];
export type Decks = {
  [key in Color]: Deck;
};

function newBoard(size: number) {
  const board: PlaceDetails[][] = [];
  for (let i = 0; i < size; i++) {
    board.push([]);
    for (let j = 0; j < size; j++) {
      board[i][j] = { state: "closed" };
    }
  }
  board[Math.floor(size / 2)][Math.floor(size / 2)].state = "open";
  return board;
}

function place(
  board: BoardState,
  x: number,
  y: number,
  color: Color,
  value: number
) {
  console.log(`card placed at ${x},${y} by ${color}`);
  const oldCard = board[y][x].card;
  console.log({ oldCard });
  if (!!oldCard && (oldCard.value >= value || oldCard.color === color)) {
    //cant place that card here
    return { newBoard: board, placed: false };
  }

  board[y][x].card = { value, color };

  for (let j = y - 1; j < y + 2; j++) {
    for (let i = x - 1; i < x + 2; i++) {
      if (canBeOpened(board, i, j)) {
        board[j][i].state = "open";
      }
    }
  }
  const finalBoard = closeInvalidOpenPlaces(board);
  return { newBoard: finalBoard, placed: true };
}

function closeInvalidOpenPlaces(board: BoardState) {
  const b = [...board];
  //if the width is 6 and there is no placed cards in the row then close it all
  b.forEach((row) => {
    if (row.find((p) => !!p.card)) return;
    if (getHeight(board) >= 6) {
      row.forEach((p) => (p.state = "closed"));
    }
  });
  // now do the same for the columns
  const bT = transpose<PlaceDetails>(b);
  bT.forEach((row) => {
    if (row.find((p) => !!p.card)) return;
    if (getWidth(board) >= 6) {
      row.forEach((p) => (p.state = "closed"));
    }
  });

  return transpose(bT);
}

function getHighestFilledRow(board: BoardState) {
  const b = [...board];
  return b.findIndex((row) => row.findIndex((p) => !!p.card) >= 0);
}

function getLeftestFilledCol(board: BoardState) {
  const b = transpose([...board]);
  return b.findIndex((row) => row.findIndex((p) => !!p.card) >= 0);
}

function canBeOpened(board: BoardState, x: number, y: number) {
  const width = getWidth(board);
  const height = getHeight(board);
  const leftest = getLeftestFilledCol(board);
  const highest = getHighestFilledRow(board);
  //   console.log(`checking x:${x} y:${y}`);
  //   console.log({ leftest, width, highest, height });
  //   console.log(`${leftest + width - 6} =< x <  ${leftest + 6}`);
  //   console.log(`y ${highest + height - 6} =< y < ${highest + 6}`);

  if (x < 0 || y < 0 || x >= board.length || y >= board.length) {
    return false;
  }
  if (leftest + width - 6 > x || x >= leftest + 6) {
    console.log(`${x} not within allowed width`);
    return false;
  }
  if (highest + height - 6 > y || y > highest + 6) {
    console.log(`${y} not within allowed height`);
    return false;
  }

  if (board[y][x].state !== "closed") {
    return false;
  }
  return true;
}

function transpose<T>(matrix: T[][]) {
  let [row] = matrix;
  return row.map((value, column) => matrix.map((row) => row[column]));
}

function getWidth(board: BoardState) {
  const b = [...board];
  return transpose(b).filter((row) => row.find((p) => !!p.card)).length;
}

function getHeight(board: BoardState) {
  const b = [...board]; // dont want to ruin the board
  return b.filter((row) => row.find((p) => !!p.card)).length;
}

function winningRow(row: PlaceDetails[], color: Color) {
  let count = 0;
  let winner = false;
  row.forEach((p) => {
    const card = p.card;
    if (!card) {
      count = 0;
      return;
    }
    if (card.color === color) {
      count += 1;
      if (count >= 4) {
        winner = true;
      }
    }
  });
  return winner;
}

interface Direction {
  x: number;
  y: number;
}

function makeDiagonalRow(
  board: BoardState,
  x: number,
  y: number,
  d: Direction
) {
  const start = { x, y };
  while (
    start.x < board.length - 1 &&
    start.y > 0 &&
    start.y < board.length - 1 &&
    start.x > 0
  ) {
    start.x += d.x;
    start.y += d.y;
  }
  const diagonalRow = [];
  for (let i = 0; i < board.length; i++) {
    const xIndex = start.x + i * -d.x;
    const yIndex = start.y + i * -d.y;

    if (yIndex > 10 || xIndex > 10 || yIndex < 0 || xIndex < 0) {
      console.log(diagonalRow);
      return diagonalRow;
    }
    diagonalRow.push(board[yIndex][xIndex]);
  }
  return diagonalRow;
}

function isWinner(board: BoardState, color: Color, x: number, y: number) {
  // check the horizontals
  // if (board.findIndex((row) => winningRow(row, color)) !== -1) return true;
  if (winningRow(board[y], color)) return true;
  // check the verticals
  if (winningRow(transpose(board)[x], color)) return true;
  // check the diagonals
  // check +ve diagonal
  if (winningRow(makeDiagonalRow(board, x, y, { x: 1, y: -1 }), color))
    return true;
  if (winningRow(makeDiagonalRow(board, x, y, { x: -1, y: -1 }), color))
    return true;

  // start at top right and go down to the right
  return false;
}

function shuffle<T>(array: T[]) {
  return array.sort(() => Math.random() - 0.5);
}

function initDecks(colors: Color[]) {
  const decks: Decks = {} as Decks;
  colors.forEach((c) => {
    const deck: Deck = [];
    const color = c;
    for (let value = 1; value < 10; value++) {
      deck.push({ value, color });
      deck.push({ value, color });
      //two of each card
    }
    decks[color] = shuffle<Card>(deck);
  });
  console.log("init decks", decks);
  return decks;
}

const GameLogic = {
  newBoard,
  initDecks,
  place,
  isWinner,
};

export default GameLogic;
