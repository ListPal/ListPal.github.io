const truncateString = (str, n = 15) => {
  let result = "";
  str.length > n ? (result = str.slice(0, n - 3) + "...") : (result = str);
  return result;
};

// O(N)
const mergeArrays = async (a, b) => {
  /* a and b are arrays of objects whose one of the keys is an id */
  // Handle preconditions
  if (!a || !b) {
    console.error("Error pruning arrays. One of them is null or undefined");
    return null;
  }
  if (a.length === 0) {
    return b;
  }

  if (b.length === 0) {
    return [];
  }

  const bIds = new Set(b.map((obj) => obj.id));
  const aIds = new Set(a.map((obj) => obj.id));
  const mergedArray = [];

  // Filter and add elements from a that are in b in their original order
  for (const obj of a) {
    if (bIds.has(obj.id)) {
      mergedArray.push(obj);
    }
  }

  // Add elements from b that are not in a
  for (const obj of b) {
    if (!aIds.has(obj.id)) {
      mergedArray.push(obj);
    }
  }

  return mergedArray;
};

export { truncateString, mergeArrays };
