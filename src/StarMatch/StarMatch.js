import {useEffect, useState} from 'react';

const Star = () => {
  return <div className="star"/>;
};

const StarList = (props) => {
  // If props.starCount is 10, creates an array of numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  // and then uses that array to create (and return) an array of 10 React elements.
  // This is basically identical to a basic for loop, just done the 'React' Way
  const countArray = Array.from(Array(props.starCount).keys()) // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  //const countArray = utils.range(1, props.starCount); // Alternate version that uses his fancy method

  return countArray.map(starId => {
    return <Star key={starId}/>
  });
};

const NumberButton = (props) => {
  return (
    <button className={'number'} style={{backgroundColor: colors[props.status]}} onClick={() => props.handleClick(props.number, props.status)}>{props.number}</button>
  )
};

const StarMatch = () => {
  // A random number of stars limited to the range of 1 - 9
  const [starCount, updateStarCount] = useState(utils.random(1, 9));
  const [availableNums, updateAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, updateCandidateNums] = useState([]);
  const [secondsLeft, updateSecondsLeft] = useState(10);

  useEffect(() => {
    // If the timer reaches zero or there are no available spaces left (because the user won), then stop the timer (i.e. don't create a timer on this render)
    if (secondsLeft > 0 && availableNums.length > 0) {
      // If the user is still playing the game (i.e. they haven't won or lost), create a timer that counts down every second.
      const timerId = setTimeout(() => {
        updateSecondsLeft(secondsLeft - 1);
      }, 1000)
      // After the app re-renders, clean-up the timer by removing it. The next render will create a new-one
      return () => clearTimeout(timerId);
    }
  })

  // Mark the selected Number as 'wrong', if the sum of the candidates > starCount
  const candidatesAreWrong = utils.sum(candidateNums) > starCount

  const getGameStatus = () => {
    // If there are no available moves left, then the game is over
    if (availableNums.length === 0) {
      //updateSecondsLeft(0);
      return 'won';
    }
    if (secondsLeft === 0) {
      return 'lost';
    }
    return 'active';
  };

  // Given the current status of the number, what should happen when this Number is clicked?
  const onNumberClick = (number, status) => {
    // If the game is no longer active (i.e. the user won or lost) OR the number was already used (i.e. it's green),
    // then nothing should happen when the number is clicked, so just return.
    if (getGameStatus() !== 'active' || status === 'used') {
      return;
    }

    // In all other situations, we need to update both state arrays, so initialize the 'new' arrays. They will be used later when updating the state.
    let newCandidateNums = candidateNums.slice(); // Start by copying the current array.
    let newAvailableNums = availableNums.slice(); // Start by copying the current array.

    // If the number was 'available', mark it as candidate by pushing it onto the candidate array. GetNumberStatus() already changed the Number's status
    // to either 'wrongCandidate' or 'validCandidate', but in both cases, the number needs to change from 'available' to a candidate, so we push it on our new array.
    // Note: you can't push a value onto the state array directly, so you must copy it, change the copied array, and then update the state with your changed array.
    // Concat creates a new array from the original and pushes the number onto the new array (without changing the original array), so it works for this purpose.
    if (status === 'available') {
      newCandidateNums = candidateNums.concat(number);
    }
    // If the status isn't 'available, then the number was already a candidate when it was clicked a 2nd time, so we need to remove it from the candidates.
    else {
      // Remove the number from the candidate array
      const index = candidateNums.indexOf(number);
      if (index !== -1) {
        newCandidateNums.splice(index, 1);
      }
      // Note: We could also use .filter() to remove the element, but it only works if the numbers are unique (they are in this case, but I wanted to show both ways).
      // Filter returns a new array containing all elements that match the condition. If the item value IS equal to the number, then we remove it.
      // const candidateArray = candidateNums.filter((element) => element !== number);
    }

    // Our newCandidateNums now has all of the candidates that it should, so check for a win condition.
    // Note: Both adding and removing candidates can cause a win condition. If the candidates are 'wrong' (i.e. their sum was greater than the starCount),
    // removing one of the them might cause a win condition once we re-sum the candidate array.
    // If the sum of all of the candidates in an array matches the starCount, then the user 'won' this round
    let sum = newCandidateNums.reduce((acc, currentValue) => acc + currentValue, 0); // Reduce returns the sum of all of the values in the array

    // If the user won this round
    if (sum === starCount) {
      // Remove the winning numbers from the 'available' array (i.e. Keep all numbers *except* the candidate numbers)
      newAvailableNums = newAvailableNums.filter(number => !newCandidateNums.includes(number));
      // Reset the stars, but only using the new available numbers. The winning 'candidate' numbers were removed.
      updateStarCount(utils.randomSumIn(newAvailableNums, 9)); // See the util method for details.
      // Reset the candidate array. The user is moving onto the next turn and they should start with a full array of numbers (e.g. 1 - 9)
      newCandidateNums = [];
    }
    // They didn't win. Our candidate array only has valid candidates now, but we need to move the number they clicked back into the available array.
    else {
      // Creates a new array from the original and pushes the number onto the new array (without changing the original array).
      newAvailableNums = availableNums.concat(number);  // The spread operator could also be used to do the same thing, but concat is more appropriate for arrays.
    }

    // Update the state arrays
    updateCandidateNums(newCandidateNums);
    updateAvailableNums(newAvailableNums);
  };

  // Returns a CSS class that matches the number's current 'status' (e.g. 'available', 'used')
  // The status will determine the background-color used
  const getNumberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used'; // Numbers that are *not* available, which means they have already been selected
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrongCandidate': 'validCandidate'; // NumberButtons that are candidates or wrong
    }
    return 'available'; // Open numbers that can be selected
  }

  const GameOver = (props) => {
    return (
      <>
        <h1 style={{color: props.gameStatus === 'won' ? 'green' : 'red'}} className="game-won">{props.gameStatus === 'won' ? 'YOU WON!' : 'GAME OVER'}</h1>
        <button className="btn" onClick={props.resetGame}>Restart the Game</button>
      </>
    )
  };

  const resetGame = () => {
    // Reset the state of the game
    updateStarCount(utils.random(1, 9))
    updateAvailableNums(utils.range(1, 9));
    updateCandidateNums([]);
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">{
          getGameStatus() !== 'active' ? <GameOver resetGame={resetGame} gameStatus={getGameStatus()}/> : <StarList starCount={starCount}/>
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

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrongCandidate: 'lightcoral',
  validCandidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default StarMatch;
