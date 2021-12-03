// Filter by first bit
// if one remains, this is answer
// otherwise move right

// generate - most common, allow ties, if tie keep 1s
// scrubber - least common, allow ties, if tie keep 0s

const mostCommon = (arr) => Number(arr.reduce((acc, cur) => acc + 2*cur-1, 0) >= 0);
const leastCommon = (arr) => Number(arr.reduce((acc, cur) => acc + 2*cur-1, 0) <= 0);

function gen(transpose, mask, modeFcn) {
    const column = transpose.shift()
    let _mode = modeFcn(column)
    const newMask = column.map((x, ii) => mask[ii]&&x===_mode)
    let jj, count = 0;
    mask.forEach((val, index) => {
        if (val) {jj = index; count++}
    })
    return (count === 1 || transpose.length === 0) ? jj : gen(transpose, newMask, modeFcn)
}

const calc = (modeFcn) => {
    const data = require("fs").readFileSync("test.txt", 'utf8').split("\n").filter(x=>x).map(row => row.split(""));
    const transpose = data[0].map((_, colIndex) => data.map(row => parseInt(row[colIndex])));
    const index = gen(transpose, Array(data.length).fill(true), modeFcn)
    return parseInt(data[index].join(""), 2)
}

console.log(calc(mostCommon) * calc(leastCommon))
