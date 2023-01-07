import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { ScoreDispatch } from "../App";
import GridCase from "./GridCase"

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(40, 2vw);
  border-style: solid;
  border-color: #b1b1b1;
  width: 80vw;
  border-width: 5px;
`
/**
 * Component that represent the gameboard
 * @param {*} props 
 */
export default function GameBoard(props) {
  const dispatch = useContext(ScoreDispatch);
  const [direction, setDirection] = useState("East")
  const [gameOver, setGameOver] = useState(false)
  const [numberOfLines] = useState(props.size / 40)
 
  const initialBoard = Array(props.size).fill("E")
  initialBoard[props.size / 2 + 1] = "S"
  initialBoard[props.size / 2 ] = "S"
  initialBoard[Math.floor(Math.random() * (props.size + 1))] = "F"

  /**
   * A lot of data is stored in the object saved in that useState. 
   * The reason for this is efficiency; React renders the component 
   * each time a state variable is modified. Because a lot of 
   * data is updated each time the snake move, it's more efficient 
   * to put all that data inside a single state variable object.
   */
  const [boardData, setBoardData] = useState({
    board: initialBoard,
    foodPosition: Math.floor(Math.random() * (props.size + 1)),
    snakePath: ["East"],
    head: props.size / 2 + 1,
    tail: props.size / 2
  })

  /**
   * Add a direction to the snake's path
   * @param {Array.<string>} oldSnakePath 
   * @param {string} newDirection 
   */
  const addToSnakePath = (oldSnakePath, newDirection) => {
    oldSnakePath.push(newDirection)
    return oldSnakePath
  }

  /**
   * Remove a direction from the snake's path
   * @param {Array.<string>} oldSnakePath 
   */
  const removeFromSnakePath = (oldSnakePath) => {
    const tailDirection = oldSnakePath.shift()
    return { tailDirection: tailDirection, newSnakePath: oldSnakePath }
  }

  /**
   * Move the snake's head on the gameboard
   * @param {number} newHead 
   * @param {number} numberOfLines 
   * @param {Array.<number>} oldSnakePath 
   * @param {string} newDirection 
   */
  const moveHead = (newHead, numberOfLines, oldSnakePath, newDirection) => {
    switch (newDirection) {
      case "North":
        if (newHead >= 0 && newHead <= 39) {
          newHead = newHead + 40 * (numberOfLines - 1)
        } else {
          newHead = newHead - 40
        }
        break
      case "East":
        if (newHead % 40 === 39) {
          newHead = newHead - 39
        } else {
          newHead = newHead + 1
        }
        break
      case "South":
        if (newHead >= 40 * (numberOfLines - 1) && newHead <= 40 * numberOfLines) {
          newHead = newHead - 40 * (numberOfLines - 1)
        } else {
          newHead = newHead + 40
        }
        break
      case "West":
        if (newHead % 40 === 0) {
          newHead = newHead + 39
        } else {
          newHead = newHead - 1
        }
        break
      default:
        break
    }

    const modifiedSnakePath = addToSnakePath(oldSnakePath, newDirection)

    return {newHead: newHead, oldSnakePath: modifiedSnakePath}
  }


  /**
   * Move the snake's tail on the gameboard
   * @param {number} newTail 
   * @param {number} numberOfLines 
   * @param {Array.<string>} oldSnakePath 
   */
  const moveTail = (newTail, numberOfLines, oldSnakePath) => {
    const topGridCase =
      newTail >= 0 && newTail <= 39 ? newTail + 40 * (numberOfLines - 1) : newTail - 40

    const bottomGridCase =
      newTail >= 40 * numberOfLines - 39 && newTail <= 40 * numberOfLines
        ? newTail - 40 * (numberOfLines - 1)
        : newTail + 40

    const rightGridCase = newTail % 40 === 39 ? newTail - 39 : newTail + 1

    const leftGridCase = newTail % 40 === 0 ? newTail + 39 : newTail - 1

    const directionAndPath = removeFromSnakePath(oldSnakePath)
    switch (directionAndPath.tailDirection) {
      case "North":
        newTail = topGridCase
        break
      case "East":
        newTail = rightGridCase
        break
      case "South":
        newTail = bottomGridCase
        break
      case "West":
        newTail = leftGridCase
        break
      default:
        break
    }

    return { newTail: newTail, newSnakePath: directionAndPath.newSnakePath }
  }
 
  /**
   * Generate a new food piece in a random position on the gameboard
   * @param {Array.<string>} newBoard 
   * @param {number} newHead 
   * @param {number} numberOfLines 
   * @param {Array.<string>} oldSnakePath 
   * @param {string} newDirection 
   */
  const generateFood = (newBoard, newHead, numberOfLines, oldSnakePath, newDirection) => {
    let newFoodPosition = 0 
    let newerHead = newHead
    if (newBoard[newHead] === "F") {
      dispatch({type: "increment"})//We dispatch an increment action to update the result on the navbar on the app
      newBoard[newHead] = "S"
      do {
        newFoodPosition = Math.floor(Math.random() * (newBoard.length + 1))
      } while (newBoard[newFoodPosition] === "S")
      newBoard[newFoodPosition] = "F"
      newerHead = moveHead(newHead, numberOfLines, oldSnakePath, newDirection).newHead
    } 
    return {newBoard: newBoard, newFoodPosition: newFoodPosition, newerHead: newerHead}
  }

  

  /**
   * An event function used to catch a key press (arrow keys)
   * and then changes the direction of the snake on the gameboard 
   * @param {KeyboardEvent} e 
   */
  const changeSnakeDirection = (e) => {
    switch (e.code) {
      case "ArrowUp":
        if (direction !== "South") {
          setDirection("North")
        }
        break
      case "ArrowRight":
        if (direction !== "West") {
          setDirection("East")
        }
        break
      case "ArrowDown":
        if (direction !== "North") {
          setDirection("South")
        }
        break
      case "ArrowLeft":
        if (direction !== "East") {
          setDirection("West")
        }
        break
      default:
        break
    }
  }

  /**
   * Add an event listener to catch the user's keypresses (arrow keys)
   */
  useEffect(() => {
    document.addEventListener("keydown", changeSnakeDirection)
    return () => {
      document.removeEventListener("keydown", changeSnakeDirection)
    }
  })

  useEffect(() => {
    /**
     * This is the game engine, it indefinitely loops the game
     * (and thus move the snake's body on the gameboard) until
     * the snake eats itself.
     */
    const loop = () => {
      if (!gameOver) {
        let {newHead, oldSnakePath} = moveHead(boardData.head, numberOfLines, boardData.snakePath, direction)
        if (boardData.board[newHead] === "S") {
          setGameOver(true)
        } else {
          boardData.board[boardData.tail] = "E"
          const {newBoard, newFoodPosition, newerHead} = generateFood(boardData.board, newHead, numberOfLines, boardData.snakePath, direction, oldSnakePath)
          const {newTail, newSnakePath} = moveTail(boardData.tail, numberOfLines, oldSnakePath)
          newBoard[newerHead] = "S"
          setBoardData({
            board: newBoard,
            head: newerHead,
            tail: newTail,
            foodPosition: newFoodPosition,
            snakePath: newSnakePath
          })
        }
      }
    }
    /**
     * The number on the setTimout could be used to add difficulty
     * to the game (for example, an easy mode where the snake moves slower)
     */
    const timeout = setTimeout(loop,25) 
    return function cleanup() {
      clearTimeout(timeout)
    }
  })

  return (
    <Board>
      {Array.from({ length: boardData.board.length }, (_, i) => {
        if (boardData.board[i] === "S") {
          return <GridCase key={i} color="#7bff95"></GridCase>
        } else if (boardData.board[i] === "F") {
          return <GridCase key={i} color="#75bbfd"></GridCase>
        } else {
          return <GridCase key={i}></GridCase>
        }
      })}
    </Board>
  )
}
