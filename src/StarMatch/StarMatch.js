import {useState} from 'react';
import Game from '../components/Game';

const StarMatch = () => {
  const [gameID, updateGameID] = useState(0)

  const startNewGame = () => {
    // When gameID is incremented, React will unmount the current Game component and render a NEW Game component in it's place
    updateGameID(gameID + 1);
  };

  return (
    <Game key={gameID} resetGame={startNewGame}/>
  )
}

export default StarMatch;
