import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
const __ASC__ = 'asc'
const __DESC__ = 'desc'
const initialState = {
  history: [
    {
      squares: Array(9).fill(null),
      order: Array.from(Array(9).keys()),
      positions: []
    }
  ],
  xIsNext: true,
  draw: false,
  stepNumber: 0,
  sortMode: __ASC__
}
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }
  handleClick(i, row) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(current.squares) || squares[i] || this.state.draw === true) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    const draw = squares.every(elem => elem !== null)
    let positions = current.positions
    if (i >= 6) {
      i = i - 6
      row = row - 4
    }
    else if (i >= 3) {
      i = i - 3
      row = row - 2
    }
    console.log(row, i)
    positions = [row, i]
    this.setState({
      history: history.concat([{ squares: squares, positions: positions, order: current.order }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      draw,
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }
  handleReset() {
    this.setState(initialState)
  }
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const positions = current.positions
    const winner = calculateWinner(current.squares)
    const moves = history.map((step, index) => {
      if (index === this.state.stepNumber) {
        console.log(123)
      }
      const isAllNull = positions.every(el => el === null)
      const desc = index
        ? 'Go to move #' + index + ' | ' + step.positions.join(':')
        : 'Go to game start'
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)} >
            {index === this.state.stepNumber
              ? <b> {desc} </b>
              : desc
            }
          </button>
        </li>
      )
    })
    console.log(history)
    let status
    if (winner) {
      status = 'winner is ' + winner
    } else {
      status = 'Next move: ' + (this.state.xIsNext ? 'X' : 'O')
    }
    if (this.state.draw) {
      status = 'DRAW: RESET GAME'
    }
    return (
      <React.Fragment>
        <h1>Game</h1>
        {status}
        <Board
          squares={current.squares}
          order={current.order}
          onClick={(i, row) => this.handleClick(i, row)}
        >
        </Board>
        <div className="game-info">
          <Reset onClick={() => this.handleReset()} > </Reset>
          <div>
            <Sort></Sort>
            <ol>{moves}</ol>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
class Board extends React.Component {
  renderSquare(count, row) {
    return (
      <Square
        key={count}
        value={this.props.squares[count]}
        onClick={() => this.props.onClick(count, row)}
      >
      </Square>
    )
  }
  renderGroupSquare() {
    let count = -1
    return this.props.order.map((i, index) => {
      if (index % 3 === 0) {
        return (
          <div
            key={index}
            className="board-row"
          >
            {[0, 1, 2].map(() => {
              count = count + 1
              return (
                this.renderSquare(count, index)
              )
            })}

          </div>
        )
      }
    })
  }
  render() {
    return (
      <div>
        {this.renderGroupSquare()}
      </div>
    )
  }
}
function Square(props) {
  return (
    <button
      className='square'
      value={props.value}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}
function Reset(props) {
  return (
    <button
      onClick={props.onClick}
    >Reset
    </button>
  )
}
function Sort(props) {
  return (
    <button
      onClick={props.onClick}
    >
      Sort
    </button>
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
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
ReactDOM.render(
  <Game></Game>,
  document.getElementById('root')
)
