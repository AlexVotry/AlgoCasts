// BigO = O(n) (Linear Time)

const nemo = ['nemo'];
const everyone = ['dory', 'bruce', 'marlin', 'nemo', 'gill', 'bloat', 'nigel', 'squirt', 'darla', 'hank'];
const large = new Array(1000).fill('nemo')


function findNemo(array) {
  let t0 = performance.now();
  array.forEach(element => {
    if (element === 'nemo') console.log('Found Nemo!');
  });
  let t1 = performance.now();
  console.log(`total time: ${t1 - t0} milliseconds`);
}

findNemo(large);

// this "performance is only helpful in comparison on my computer"
// better to keep track of how many operations it takes to complete
