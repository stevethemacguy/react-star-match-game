import Star from './Star';
import utils from '../math.utils';

// A list of Star components.
const StarList = props => (
  <>
    {/*Creates an array of numbers, from 1 to starCount, and then uses that array to create the stars.*/}
    {utils.range(1, props.starCount).map(starId => (
      <Star key={starId}/>
    ))}
  </>
);

// Alternative way to create an array of components without using the author's util function.
// WARNING: This mostly works, but it creates a bug that occasionally causes the game to enter an un-winnable
// state where none of the remaining available numbers add up to the total starCount.
//
// const StarList = (props) => {
//   // If props.starCount is 9, creates an array of numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8]
//   // and then uses that array to create (and return) an array of 9 React elements.
//   // This is basically identical to a basic for loop, just done the 'React' Way
//   const countArray = Array.from(Array(props.starCount).keys()) // => [0, 1, 2, 3, 4, 5, 6, 7, 8]
//
//   return countArray.map(starId => {
//     return <Star key={starId}/>
//   });
// };

export default StarList;
