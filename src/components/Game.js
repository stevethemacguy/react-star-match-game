import utils from '../math.utils';
import StarList from '../components/StarList';
import GameOver from '../components/GameOver';
import NumberButton from '../components/NumberButton';
import useGameState from '../hooks/useGameState';

// The Game component describes the Game's UI, but doesn't directly manage the state. The state is managed by the useGameState() Hook.
const Game = (props) => {
  // Use useGameState Hook's exported members (i.e the state) by destructuring the returned object into local variables.
  const { starCount, availableNums, candidateNums, secondsLeft, updateGameState } = useGameState();

  // Mark the selected Number as 'wrong', if the sum of the candidates > starCount
  const candidatesAreWrong = utils.sum(candidateNums) > starCount;

  // Returns a string representation of the Number's current 'status' (e.g. 'available', 'used').
  // The returned value is used as a CSS class that determines the selected Number's background-color.
  const getNumberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used'; // 'Used' numbers are no longer available; they have already been selected/used.
    }

    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrongCandidate': 'validCandidate'; // NumberButtons that are candidates or wrong
    }
    return 'available'; // Open numbers that can be selected
  }

  // Returns 'active' if moves are still available, 'won' if no moves are left, and 'lost' if moves are left but the timer has reached zero.
  const getGameStatus = () => {
    // If there are no available moves left, then the game is over
    if (availableNums.length === 0) {
      return 'won';
    }
    if (secondsLeft === 0) {
      return 'lost';
    }
    return 'active';
  };

  // Given the the current status of the selected number, what should happen when the number is clicked?
  const onNumberClick = (number, status) => {
    // If the game is no longer active (i.e. the user won or lost) OR the number was already used (i.e. it's green),
    // then nothing should happen when the number is clicked, so just return.
    if (getGameStatus() !== 'active' || status === 'used') {
      return;
    }
    // In all other situations, use the Hook to update the state.
    updateGameState(number, status);
  };

  // Render the game
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">{
          // If the game is over, render the GameOver component. Otherwise, render the StarList.
          getGameStatus() !== 'active' ? <GameOver resetGame={props.resetGame} gameStatus={getGameStatus()}/> : <StarList starCount={starCount}/>
        }
        </div>
        <div className="right">
          {/* Identical to the the StarList function, but uses his fancy 'range' function in place instead*/}
          {utils.range(1, 9).map(number =>
            <NumberButton key={number} number={number} status={getNumberStatus(number)} handleClick={onNumberClick}/>
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

export default Game;
