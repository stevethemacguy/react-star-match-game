import {useState} from 'react';

/**
 * Author: Steven Dunn
 * Date Created: June 28, 2021
 * Dependencies: None
 */

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
    <button className={'number'} style={{backgroundColor: props.numberColor}} onClick={() => props.handleClick(props.number)}>{props.number}</button>
  )
};

const StarMatch = () => {
  // A random number of stars limited to the range of 1 - 9
  const [starCount, updateStarCount] = useState(utils.random(1, 9));

  // An array of color states. One for each Button. Initialized to the 'available' state
  //const colorStateArray = starCount.map(number => 'available');
  const colorStateArray = [];
  for (let i = 0; i < 10; i++) {
    colorStateArray.push('available');
  }

  let [numberStateArray, updateNumberState] = useState(colorStateArray);

  const selectNumber = (number) => {
    const arrayToUpdate = numberStateArray.slice();
    arrayToUpdate[number] = 'used';
    updateNumberState(arrayToUpdate);
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          <StarList starCount={starCount}/>
        </div>
        <div className="right">
          {/* Identical to the the StarList function, but uses his fancy 'range' function in place instead*/}
          {utils.range(1, 9).map(number =>
            <NumberButton key={number} number={number} numberColor={colors[numberStateArray[number]]} handleClick={selectNumber}/>
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: 10</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
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
