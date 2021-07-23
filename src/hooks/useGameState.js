// Custom Hook used to manage the game's state (i.e. initialize and update it), as well as manage side effects.
import {useEffect, useState} from 'react';
import utils from '../math.utils';

const useGameState = () => {
  // A random number of stars between 1 - 9. The game involves clicking 1 or more numbers that add up to the starCount.
  const [starCount, updateStarCount] = useState(utils.random(1, 9));
  // When the game starts, all Numbers (1 - 9) are 'available'. Numbers are considered 'used' (and turn green) once they have been selected and match current starCount.
  const [availableNums, updateAvailableNums] = useState(utils.range(1, 9));
  // Candidate numbers are those that have been clicked (e.g. 4), but that do not (yet) match the current starCount (e.g. 7). They can be used with other
  // candidates (e.g. 3) to add up to the total startCount (e.g. 7). Candidates are valid (blue) if their sum is < starCount and invalid (red) if their sum is > starCount
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
  });

  // Given the the current status of the number, what should happen when the number is clicked?
  const updateGameState = (number, status) => {
    // Initialized the 'new' state values, which will be modified and then used to update the state.
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

    // Update the state with the newly computed values
    updateCandidateNums(newCandidateNums);
    updateAvailableNums(newAvailableNums);
  };

  return { starCount, availableNums, candidateNums, secondsLeft, updateGameState};
}

export default useGameState;
