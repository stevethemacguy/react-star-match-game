import Star from './Star';

// A list of Star components.
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

export default StarList;
