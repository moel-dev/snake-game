import React, { useReducer, useState } from "react"
import styled from "styled-components"
import "./App.css"
import GameBoard from "./components/GameBoard"
import NavBar from "./components/NavBar"

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 2vw;
`
export const ScoreDispatch = React.createContext(null);

const initialScore = 0

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'reset':
      return 0;
    default:
      throw new Error();
  }
}


function App() {
  const [score, dispatch] = useReducer(reducer, initialScore);
  const [keyGameBoard, setKeyGameBoard] = useState(0)
  const restart = () => {
    dispatch({type: 'reset'})
    setKeyGameBoard(keyGameBoard + 1)
  }
  return (
    <div key={keyGameBoard} >
      <ScoreDispatch.Provider value={dispatch}>
        <NavBar event={restart} score={score} ></NavBar>
        <AppContainer>
          <GameBoard size={720}></GameBoard>
        </AppContainer>
      </ScoreDispatch.Provider>
    </div>
  )
}

export default App
