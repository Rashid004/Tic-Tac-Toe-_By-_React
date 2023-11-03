import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/Gameboard";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "../Winning-Combination";
import GameOver from "./components/GameOver";

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
}

function deriveActivePlayer(gameTurns) {
   let currentPlayer = "X";
   if (gameTurns.length > 0 && gameTurns[0].player === "X") {
     currentPlayer = "O";
   }
   return currentPlayer;
}

function deriveGameBoards(gameTurns) {
let gameBoard = [...INITIAL_GAME_BOARD.map((arr) => [...arr])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard,players) {
   let winner;

   for (const combination of WINNING_COMBINATIONS) {
     const firstSquareSymbol =
       gameBoard[combination[0].row][combination[0].column];
     const secondSquareSymbol =
       gameBoard[combination[1].row][combination[1].column];
     const thirdSquareSymbol =
       gameBoard[combination[2].row][combination[2].column];

     if (
       firstSquareSymbol &&
       firstSquareSymbol === secondSquareSymbol &&
       firstSquareSymbol === thirdSquareSymbol
     ) {
       winner = players[firstSquareSymbol];
     }
   }
   return winner;
}

function App() {

const [players, setPlayers] = useState(PLAYERS);
const [gameTurns,setGameTurns] = useState([]);

const activePlayer = deriveActivePlayer(gameTurns);

 const gameBoard = deriveGameBoards(gameTurns);

const winner = deriveWinner(gameBoard,players)

const hasDraw = gameTurns.length === 9 && !winner;

 function handleSelectSquare(rowIndex,colIndex) {
  setGameTurns((prevTurns) => {
  const currentPlayer = deriveActivePlayer(prevTurns);

  const updatedTurns = [
    { square: { row: rowIndex, col: colIndex }, player:currentPlayer },...prevTurns,
    ];
    return updatedTurns;
  })
}

function handleRestart() {
  setGameTurns([]);
}

function handlePlayerName(symbol,newName) {
  setPlayers(prevPlayers => {
    return {
      ...prevPlayers,
      [symbol]:newName
    }
  });
};
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerName}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerName}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}
export default App
