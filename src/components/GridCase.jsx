import styled from "styled-components"

const Grid = styled.div`
  border-style: none;
  border-color: #fff;
  border-width: thin;
  width: 2vw;
  height: 2vw;
  grid-column: span 1;
  background-color: ${props => props.color};
`

export default function GridCase(props) {
  return <Grid color={props.color}></Grid>
}
