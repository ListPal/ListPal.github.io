const truncateString = (str, n = 15) => {
  let result = "";
  str = str.charAt(0).toUpperCase() + str.slice(1)
  str.length > n ? (result = str.slice(0, n - 3) + "...") : (result = str);
  return result;
};

// O(N)
const mergeArrays = async (mine, theirs) => {
  /* mine and theirs are arrays of objects whose one of the keys is an id */
  // Handle preconditions
  if (!mine || !theirs) {
    console.error("Error pruning arrays. One of them is null or undefined");
    return null;
  }
  if (mine.length === 0) {
    return theirs;
  }

  if (theirs.length === 0) {
    return [];
  }
  const theirMap = new Map(theirs.map(obj => [obj.id, obj]))
  const theirIds = new Set(theirs.map((obj) => obj.id));
  const myIds = new Set(mine.map((obj) => obj.id));
  const mergedArray = [];

  // Filter and add elements from mine that are in theirs in my original order
  for (const obj of mine) {
    if (theirIds.has(obj.id)) {
      mergedArray.push(theirMap.get(obj.id)); // Keep theirs for merge resolution
    }
  }

  // Add elements from theirs that are not in mine
  for (const obj of theirs) {
    if (!myIds.has(obj.id)) {
      mergedArray.push(obj);
    }
  }

  return mergedArray;
};

export { truncateString, mergeArrays };
