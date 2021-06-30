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
    <button className={'number'} style={{backgroundColor: colors[props.status]}} onClick={() => props.handleClick(props.number, props.status)}>{props.number}</button>
  )
};

const StarMatch = () => {
  // A random number of stars limited to the range of 1 - 9
  const [starCount, updateStarCount] = useState(utils.random(1, 9));

  // An array of color states. One for each Button. Initialized to the 'available' state

  const [availableNums, updateAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, updateCandidateNums] = useState([]);

  // Mark the selected Number as 'wrong', if the sum of the candidates > starCount
  const candidatesAreWrong = utils.sum(candidateNums) > starCount

  // Given the current status of the number, what should happens when this Number is clicked?
  const onNumberClick = (number, status) => {
    // If the number is already used (i.e. green), don't do anything. Nothing should happen when the number is clicked.
    if (status === 'used') {
      return;
    }

    // In all other situations, we need to update both state arrays, so initialize the 'new' arrays. They will be used later when updating the state.
    let newCandidateArray = candidateNums.slice(); // Start by copying the current array.
    let newAvailableArray = availableNums.slice(); // Start by copying the current array.

    // If the number was 'available', mark it as candidate by pushing it onto the candidate array. GetNumberStatus() already handled setting the status
    // to either 'wrongCandidate' or 'validCandidate', but in either case, the number needs to be a candidate, so we push it on our new array
    // Note: you can't push a value onto the state array directly, so you must copy it, change the copied array, and then update the state with your changed array.
    // Concat creates a new array from the original and pushes the number onto the new array (without changing the original array), so it works for this purpose.
    if (status === 'available') {
      newCandidateArray = candidateNums.concat(number);
    }
    // If the status isn't 'available, then the number was already a candidate when it was clicked a 2nd time, so we need to remove it from the candidates.
    else {
      // Remove the number from the candidate array
      const index = candidateNums.indexOf(number);
      if (index !== -1) {
        newCandidateArray.splice(index, 1);
      }
      // Note: We could also use .filter() here, but it only works if the number values are guaranteed to be unique.
      // Filter returns a new array containing all elements that match the condition. If the item value IS equal to the number, then we remove it.
      // const candidateArray = candidateNums.filter((element) => element !== number);
    }

    // Our newCandidateArray now has all of the candidates that it should, so check for a win condition.
    // Note: Both adding and removing candidates can cause a win condition. If the candidates are 'wrong' (i.e. their sum was greater than the starCount),
    // removing one of the them might cause a win condition once we re-sum the candidate array.
    if (newCandidateArray.length > 0)  {
      // If the sum of all of the candidates in an array matches the starCount, then the user 'won' this round
      let sum = newCandidateArray.reduce((acc, currentValue) => acc + currentValue); // Reduce returns the sum of all of the values in the array

      // If the user won
      if (sum === starCount) {
        // Remove the winning numbers from the 'available' array (i.e. Keep all numbers *except* the candidate numbers)
        newAvailableArray = newAvailableArray.filter(number => !newCandidateArray.includes(number));

        // Reset the stars, but only using the new available numbers. The winning 'candidate' numbers were removed.
        updateStarCount(utils.randomSumIn(newAvailableArray, 9)); // See the util method for details.

        // Reset the candidate array. The user is moving onto the next turn and they should start with a full array of numbers (e.g. 1 - 9)
        newCandidateArray = [];
      }
      // The didn't win. Our candidate array only has valid candidates now, but we need to move the number they clicked back into the available array
      else {
        // This creates a new array from the original and pushes the number onto the new array (without changing the original array)
        newAvailableArray = availableNums.concat(number);  // The spread operator could also be used to do the same thing, but concat is more appropriate for arrays.
      }
    }

    // Update the state arrays
    updateCandidateNums(newCandidateArray);
    updateAvailableNums(newAvailableArray);
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
            <NumberButton key={number} number={number} status={getNumberStatus(number)} handleClick={onNumberClick}/>
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
