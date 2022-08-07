import React, { useState } from "react"
import styled from "styled-components"
import "./App.css"
import GameBoard from "./components/GameBoard"
import NavBar from "./components/NavBar"

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 2vw;
`

function App() {

  const [keyGameBoard, setKeyGameBoard] = useState(0)
  const restart = () => {
    debugger;
    setKeyGameBoard(keyGameBoard + 1)
  }
  return (
    <div key={keyGameBoard} >
        <NavBar event={restart} ></NavBar>
        <AppContainer>
          <GameBoard size={720}></GameBoard>
        </AppContainer>
    </div>
  )
}

export default App
