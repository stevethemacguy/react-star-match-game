// Available colors for each Number
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrongCandidate: 'lightcoral',
  validCandidate: 'deepskyblue',
};

const NumberButton = (props) => {
  return (
    <button className={'number'} style={{backgroundColor: colors[props.status]}} onClick={() => props.handleClick(props.number, props.status)}>{props.number}</button>
  )
};

export default NumberButton
