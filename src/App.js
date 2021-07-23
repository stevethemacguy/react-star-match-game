import './app.css';
import {useState} from 'react';
import Game from './components/Game';

// You can wrap StarMatch in an outer App() component if you want, but it's not required. Here, we just export it directly.
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
