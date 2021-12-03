const fs = require("fs");

const records = fs.readFileSync("input.txt", 'utf8').split("\n").filter(x=>x).reduce((acc, cur) => {
    let ii = cur.length
    if (!acc.length) acc = Array(ii).fill(0)
    while (ii--) acc[ii] += (2*parseInt(cur.charAt(ii))-1)
    return acc
}, []).map(x=>((x/Math.abs(x))+1)/2);

const invert = records.map(bit => Number(!bit));

const gamma = parseInt(records.join(""),2)
const epsilon = parseInt(invert.join(""),2)
console.log(gamma, epsilon, epsilon*gamma)
