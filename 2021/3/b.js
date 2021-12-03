// Filter by first bit
// if one remains, this is answer
// otherwise move right

// generate - most common, allow ties, if tie keep 1s
// scrubber - least common, allow ties, if tie keep 0s

const fs = require("fs");

const records = fs.readFileSync("test.txt", 'utf8').split("\n").filter(x=>x).map(row => row.split(""));
const transpose = records[0].map((_, colIndex) => records.map(row => row[colIndex]));

const genScore = (transpose) => {

    transpose.forEach((column) => {
        column.forEach((value) => {})
    })

}


// reduce((acc, cur) => {
//     let ii = cur.length
//     if (!acc.length) acc = Array(ii).fill(0)
//     while (ii--) acc[ii] += (2*parseInt(cur.charAt(ii))-1)
//     return acc
// }, []).map(x=>((x/Math.abs(x))+1)/2);

// const invert = records.map(bit => Number(!bit));

// const gamma = parseInt(records.join(""),2)
// const epsilon = parseInt(invert.join(""),2)
console.log(records, transpose)
