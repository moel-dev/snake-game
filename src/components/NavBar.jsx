import { useState } from "react";
import styled from "styled-components";

const NavigationBar = styled.div`
  width: 100%;
  height: 60px;
  background-color: #2b2b2b;
  border-bottom-width: thin;
  border-bottom-style: solid;
  border-bottom-color: #858585;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
    color: white;
    font-size: x-large;
    margin-left: 20px;;
`

const Restart = styled.button`
    border-style: solid;
    border-width: thin;
    border-color: #c8cccc;
    background: none;
    color: #c8cccc;
    border-radius: 0.35vw;
    font-size: 0.9vw;
    padding: 0.3vw;
    margin-right: 20px;;
    &:hover {
      background-color:#c8cccc;
      color:#2b2b2b;
      cursor: pointer;
    }
    &:active {
      background-color:#8b8d8d;
      border-color: #8b8d8d;
      color:#2b2b2b;
      cursor: pointer;
    }
`

const ScoreBox = styled.div`
  color: #c8cccc;
  display: flex;
  flex-direction: row;
`

const Score = styled.div`
  margin: 10px;
`
export default function NavBar(props) {
  const [restartEvent] = useState(() => props.event)

  const restartButton = (event) => {
    debugger;
    restartEvent()
  }

  return (
    <NavigationBar>
      <Title>
        The Snake Game
      </Title>
      <ScoreBox>
        <Score>
          Your score: 0
        </Score>
      </ScoreBox>

      <Restart onClick={restartButton}>Restart</Restart>
    </NavigationBar>
  );
}
