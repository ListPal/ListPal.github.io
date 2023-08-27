const truncateString = (str, n=15) => {
    let result = ''
    str.length > n ? result = str.slice(0, n-5) + '...' : result = str
    return result
}

export {truncateString}