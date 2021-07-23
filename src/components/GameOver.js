// The GameOver component is shown when the user either wins or loses the game. In both situations, the user is allowed to restart the game.
const GameOver = (props) => {
  return (
    <>
      <h1 style={{color: props.gameStatus === 'won' ? 'green' : 'red'}} className="game-won">{props.gameStatus === 'won' ? 'YOU WON!' : 'GAME OVER'}</h1>
      <button className="btn" onClick={props.resetGame}>Restart the Game</button>
    </>
  )
};

export default GameOver;
