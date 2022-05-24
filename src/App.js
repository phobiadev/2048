import { useState, useEffect } from "react"
import { useSwipeable } from 'react-swipeable';
import Grid from "./components/Grid"

const debug = true

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function copy(item) {
  return JSON.parse(JSON.stringify(item))
}

function reverse(array) {
  return [].concat(array).reverse();
}

function createGrid() {
  let newGrid = new Array(4).fill(new Array(4).fill(null))
  let first = [randomNumber(0,4),randomNumber(0,4)]
  let second = [randomNumber(0,4),randomNumber(0,4)]
  do {
    second = [randomNumber(0,4),randomNumber(0,4)]
  } while (JSON.stringify(second) === JSON.stringify(first))
  newGrid = JSON.parse(JSON.stringify(newGrid))
  for (let index of [first,second]) {
    newGrid[index[0]][index[1]] = 2

  }
  return newGrid
}

function DebugTooltip() {
  return <a className="text-[10px] text-violet-300 text-center m-[1px]">(debug)</a>
}


function getKey(event) {
  let e = String.fromCharCode(event.keyCode).toLowerCase()
  console.log(e)
  switch (e) {
    case "&":
      return "w"
      break;
    case "%":
      return "a"
      break;
    case "(":
      return "s"
      break;
    case "'":
      return "d"
      break;
    default:
      return e
  }
}

export default function App() {
  const [grid,setGrid] = useState(createGrid())
  const [score, setScore] = useState(0)
  const [highscore, setHighScore] = useState(0)
  const [gameOver,setGameOver] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("current-score")) {
      setScore(JSON.parse(localStorage.getItem("current-score")))
    }
    if (localStorage.getItem("highscore")) {
      setHighScore(JSON.parse(localStorage.getItem("highscore")))
    }
    if (localStorage.getItem("current-game")) {
      setGrid(JSON.parse(localStorage.getItem("current-game")))
    }
    if (localStorage.getItem("current-game-over")) {
      setGameOver(JSON.parse(localStorage.getItem("current-game-over")))
    }
  },[])

  useEffect(() => {

    localStorage.setItem("highscore",JSON.stringify(highscore))
  },[highscore])

  useEffect(() => {
    let handler = event => move(getKey(event))

    window.addEventListener("keydown",handler)

    localStorage.setItem("current-game",JSON.stringify(grid))

    return () => window.removeEventListener("keydown",handler)
  },[grid])

  useEffect(() => {
    localStorage.setItem("current-game-over",JSON.stringify(gameOver))
  },[gameOver])

  useEffect(() => {
    localStorage.setItem("current-score",JSON.stringify(score))
  },[score])

  // debug
  function endGame() {
    setGameOver(true)
  }

  function resetGame() {
    setGrid(createGrid())
    setScore(0)
    setGameOver(false)
  }

  function moveLeft(row, changeScore) {
    let newRow
    let solids = []
    for (let i of row) {
      if (i !== null) {
        solids.push(i)
      }
    }
    newRow = copy(solids)
    for (let i of row) {
      if (i === null) {
        newRow.push(null)
      }
    }
  
    for (let i = 0; i < newRow.length-1; i++) {
      if (newRow[i] == newRow[i+1] && newRow[i] !== null) {
        newRow[i] *= 2
        if (changeScore) {
          setScore(score + newRow[i])
          if ((score + newRow[i]) > highscore) {
            setHighScore(score + newRow[i])
          }
          localStorage.setItem("current-score",JSON.stringify(score + newRow[i]))
        }
        newRow.splice(i+1,1)
        newRow.push(null)
      }
    }
  
    return newRow
  }
  
  function moveGridLeft(grid, changeScore) {
    let newRow
    let newGrid = copy(grid)
    for (let i = 0; i < grid.length; i++) {
      newGrid[i] = moveLeft(newGrid[i],changeScore)
    }
    return newGrid
  }
  
  function moveGridRight(grid, changeScore) {
    let newRow
    let newGrid = copy(grid)
    for (let i = 0; i < grid.length; i++) {
      newGrid[i].reverse()
      newGrid[i] = moveLeft(newGrid[i],changeScore)
      newGrid[i].reverse()
    }
    return newGrid
  
  }
  
  function moveGridUp(grid, changeScore) {
    let newColumn
    let newGrid = copy(grid)
    for (let i = 0; i < grid.length; i++) {
      let column = []
      for (let row of newGrid) {
        column.push(row[i])
      }
      column = moveLeft(column,changeScore)
      for (let x = 0; x < grid.length; x++) {
        newGrid[x][i] = column[x]
      }
    }
    return newGrid
  }
  
  function moveGridDown(grid, changeScore) {
    let newColumn
    let newGrid = copy(grid)
    for (let i = 0; i < grid.length; i++) {
      let column = []
      for (let row of newGrid) {
        column.push(row[i])
      }
      column.reverse()
      column = moveLeft(column,changeScore)
      column.reverse()
  
      for (let x = 0; x < grid.length; x++) {
        newGrid[x][i] = column[x]
      }
    }
    return newGrid
  }
  

  function move(direction) {
    if (!gameOver) {
      let newGrid = grid
      switch (direction) {
        case "w":
          newGrid = moveGridUp(grid, true)
          break;
        case "a":
          newGrid = moveGridLeft(grid, true)
          break;
        case "s":
          newGrid = moveGridDown(grid, true)
          break;
        case "d":
          newGrid = moveGridRight(grid, true)
          break;
        default:
          return;
      }
      
      console.log(JSON.stringify(newGrid) === JSON.stringify(grid))

      let foundNewPos = false
      let untaken = []
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (newGrid[i][j] == null) {
            untaken.push([i,j])
          }
        }
      }

      if (untaken.length < 0) {
        setGameOver(true)
        return
      }

      let selected = untaken[randomNumber(0,untaken.length-1)]

      if (!(JSON.stringify(grid) == JSON.stringify(newGrid))) {
        if (Math.random() > 0.2) {
          newGrid[selected[0]][selected[1]] = 2
        }
        else {
          newGrid[selected[0]][selected[1]] = 4
        }
      }

      let over = true;

      setGrid(newGrid)

      for (let direction of [moveGridLeft,moveGridRight,moveGridUp,moveGridDown]) {
        if (JSON.stringify(direction(newGrid, false)) !== JSON.stringify(newGrid)) {
          over = false
        }
      }

      if (over) {
        setGameOver(true)
      }
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => move("a"),
    onSwipedRight: () => move("d"),
    onSwipedUp: () => move("w"),
    onSwipedDown: () => move("s"),

    preventDefaultTouchmoveEvent: true
  });

  

  return (
    <div className="w-[100vw] items-center justify-center grid">

      <div className="flex justify-center mt-[100px] mb-[5px] md:mt-[30px] text-[#776e65] space-x-5">
        <h1 className="font-bold text-5xl">2048</h1>
        <h1 className="text-5xl font-light trs">{score}</h1>
      </div>

      <div className="grid mb-[20px] justify-center text-[#776e65] text-center">
        <h1 className="text-xl font-light">highscore: {highscore}</h1>
      </div>

      <div className="flex justify-center items-center mt-[40px] md:mt-[10px] space-x-2">
        <button onClick={resetGame}>Reset Game</button>
        {debug &&
        <>
          <button className="debug flex justify-center" onClick={endGame}>End Game <DebugTooltip /></button>
        </>
        }
      </div>

      <div className="flex items-center justify-center grid-container text-center md:mt-[100px] 2xl:mt-[140px] mb-[40px]">
        <div {...handlers} id="grid" className={`over-trs flex items-center justify-center ${gameOver ? "disabled": ""}`}>
          <Grid grid={grid} />
        </div>
        <h1 className="over-trs absolute text-7xl font-extrabold text-rose-500" style={gameOver ? {color: "#a11b45"} : {transform: "scale(0.2)"}}>{gameOver ? "GAME OVER": ""}</h1>
      </div>

    </div>
  )
}
