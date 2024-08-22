import { useState } from 'react'

function Square({ value, onSquareClick }) {
  return (
    <button
      className="square text-sky-400 w-28 h-28 sm:w-32 sm:h-32"
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return
    }
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  const draw = currentMove === 9
  let status
  if (winner) {
    status = 'Winner: ' + winner
  } else if (draw) {
    status = "It's a Draw!"
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  // Render 3 rows
  const rows = [...Array(3)].map((x, i) => {
    // Render 3 squares
    const rowSquares = [...Array(3)].map((x, j) => {
      return (
        <Square
          key={3 * i + j}
          value={squares[3 * i + j]}
          onSquareClick={() => handleClick(3 * i + j)}
        />
      )
    })

    return (
      <div key={i} className="board-row">
        {rowSquares}
      </div>
    )
  })

  // Board component returns
  return (
    <>
      <div className="status mb-8 text-2xl text-sky-300 text-center md:mb-14">
        {status}
      </div>
      {rows}
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  function handleReset() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }

  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = 'Go to move #' + move
    } else {
      description = 'Go to beginning'
    }

    return currentMove === move && move > 0 ? (
      <li key={move} className="list-item text-slate-200">
        You are at move #{move}
      </li>
    ) : (
      <li key={move} className="list-item ">
        <button
          onClick={() => jumpTo(move)}
          className="moves-btn hover:text-slate-200"
        >
          {description}
        </button>
      </li>
    )
  })

  return (
    <div className="game container mx-auto flex flex-col space-y-12 justify-center items-center md:mt-10 md:flex-row md:items-start md:justify-evenly md:space-y-0">
      <h1 className="text-2xl font-bold">Tic Tac Toe</h1>
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info flex flex-col items-center text-xs">
        <h2 className="text-slate-300 text-lg md:mb-16">Game history:</h2>
        <ol className="space-y-4 text-slate-500 bg-slate-800 py-4 px-6">
          {moves}
        </ol>
        <button
          onClick={() => handleReset()}
          className="p-3 w-full mt-4 bg-slate-800 hover:bg-sky-800"
        >
          Rest game
        </button>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [8, 4, 0],
    [6, 4, 2],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}
