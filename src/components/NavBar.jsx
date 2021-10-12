import { Component } from "react";
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
  justify-content: left;
  align-items: center;
`;

const Title = styled.div`
    color: white;
    font-size: x-large;
    margin-left: 20px;;
`
export default class NavBar extends Component {
  render() {
    return (
      <NavigationBar>
        <Title>
          The Snake Game
        </Title>
      </NavigationBar>
    );
  }
}
