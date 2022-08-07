import { Component } from "react"
import styled from "styled-components"
import GridCase from "./GridCase"

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(40, 2vw);
  border-style: solid;
  border-color: #ffaaaa;
  width: 80vw;
  border-width: 5px;
`

export default class GameBoard extends Component {
  constructor(props) {
    super(props)
    const board = Array(this.props.size).fill("E")
    const head = this.props.size / 2 + 1
    const tail = this.props.size / 2
    const foodPosition = Math.floor(Math.random() * (this.props.size + 1))

    board[head] = "S"
    board[tail] = "S"
    board[foodPosition] = "F"

    this.state = {
      board: board,
      foodPosition: foodPosition,
      gameOver: false,
      direction: "East",
      snakePath: ["East"],
      head: head,
      tail: tail
    }

    this.changeSnakeDirectionNew = e => {
      this.changeSnakeDirection(e)
    }
  }

  componentDidMount() {
    this.starGame()
    document.addEventListener("keydown", this.changeSnakeDirectionNew)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.changeSnakeDirectionNew)
  }

  starGame() {
    const loop = () => {
      if (!this.state.gameOver) {
        const board = this.state.board.slice()
        board[this.state.tail] = "E"

        let newHead = this.moveHead()
        if (board[newHead] === "S") {
          this.setState({
            gameOver: true,
          })
        } else {
          newHead = this.generateFood(board, newHead)

          const tailAndPath = this.moveTail()

          board[newHead] = "S"

          this.setState({
            board: board,
            head: newHead,
            tail: tailAndPath.tail,
            snakePath: tailAndPath.snakePath
          })

          setTimeout(loop, 25)
        }
      }
    }
    loop()
  }

  generateFood(board, newHead) {
    if (board[newHead] === "F") {
      board[newHead] = "S"
      let newFoodPosition
      do {
        newFoodPosition = Math.floor(Math.random() * (this.props.size + 1))
      } while (board[newFoodPosition] === "S")
      board[newFoodPosition] = "F"
      this.setState({
        head: newHead,
        foodPosition: newFoodPosition,
      })
      newHead = this.moveHead()
    }
    return newHead
  }

  moveHead() {
    const numberOfLines = this.state.board.length / 40
    let head = this.state.head

    switch (this.state.direction) {
      case "North":
        if (head >= 0 && head <= 39) {
          head = head + 40 * (numberOfLines - 1)
        } else {
          head = head - 40
        }
        break
      case "East":
        if (head % 40 === 39) {
          head = head - 39
        } else {
          head = head + 1
        }
        break
      case "South":
        if (head >= 40 * (numberOfLines - 1) && head <= 40 * numberOfLines) {
          head = head - 40 * (numberOfLines - 1)
        } else {
          head = head + 40
        }
        break
      case "West":
        if (head % 40 === 0) {
          head = head + 39
        } else {
          head = head - 1
        }
        break
      default:
        break
    }

    this.addToSnakePath()

    return head
  }

  moveTail() {
    const numberOfLines = this.state.board.length / 40
    let tail = this.state.tail

    const topGridCase =
      tail >= 0 && tail <= 39 ? tail + 40 * (numberOfLines - 1) : tail - 40

    const bottomGridCase =
      tail >= 40 * numberOfLines - 39 && tail <= 40 * numberOfLines
        ? tail - 40 * (numberOfLines - 1)
        : tail + 40

    const rightGridCase = tail % 40 === 39 ? tail - 39 : tail + 1

    const leftGridCase = tail % 40 === 0 ? tail + 39 : tail - 1

    const directionAndPath = this.removeFromSnakePath()
    switch (directionAndPath.tailDirection) {
      case "North":
        tail = topGridCase
        break
      case "East":
        tail = rightGridCase
        break
      case "South":
        tail = bottomGridCase
        break
      case "West":
        tail = leftGridCase
        break
      default:
        break
    }

    return {tail: tail, snakePath: directionAndPath.snakePath}
  }

  addToSnakePath() {
    const snakePath = this.state.snakePath
    snakePath.push(this.state.direction)
  }

  removeFromSnakePath() {
    const snakePath = this.state.snakePath
    const tailDirection = snakePath.shift()
    return {tailDirection: tailDirection, snakePath: snakePath}
  }

  changeSnakeDirection(e) {
    switch (e.code) {
      case "ArrowUp":
        if(this.state.direction !== "South"){
          this.setState({
            direction: "North",
          })
        }
        break
      case "ArrowRight":
        if(this.state.direction !== "West"){
          this.setState({
            direction: "East",
          })
        }
        break
      case "ArrowDown":
        if(this.state.direction !== "North"){
          this.setState({
            direction: "South",
          })
        }
        break
      case "ArrowLeft":
        if(this.state.direction !== "East"){
          this.setState({
            direction: "West",
          })
        }
        break
      default:
        break
    }
  }

  render() {
    return (
      <Board>
        {Array.from({ length: this.state.board.length }, (_, i) => {
          if (this.state.board[i] === "S") {
            return <GridCase key={i} color="#007519"></GridCase>
          } else if (this.state.board[i] === "F") {
            return <GridCase key={i} color="#74ffdc"></GridCase>
          } else {
            return <GridCase key={i}></GridCase>
          }
        })}
      </Board>
    )
  }
}
