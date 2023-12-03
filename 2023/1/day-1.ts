const {readFileSync} = require("fs");
interface Digits {
    [name: string] : number
}
/**
 * 1. calibration document is the input, lines of text
 * 2. recover calibration value from each line
 * 3. first digit and last digit in string is value
 * 4. calculate sum of the values in the calibration document
 * 
 * Special cases are:
 * - No digits
 * - One digit
 * - Blank line
 * - First digit is zero
 */
const recoverCode = (line: String): number => {
    if (line.length === 0) return NaN; // blank line
    // Max word size to look ahead
    const digits: Digits = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9
    }
    const keyLength = Object.keys(digits).map(key => key.length)
    const lookAheadMax: number = Math.max(...keyLength);
    const lookAheadMin: number = Math.min(...keyLength);

    let result: string = "";
    let ii = 0; // memoize for reverse search
    outer:
    for (ii; ii<line.length; ii++) {
        let token = line[ii];
        if (!isNaN(parseInt(token, 10))) {
            result = result.concat(token);
            break outer;
        } else if (ii === line.length - 1) {
            return NaN; // no digits
        } else {
            for (let kk=ii+lookAheadMin; kk<Math.max(ii+lookAheadMax, line.length); kk++) {
                const key: string = line.slice(ii, kk);
                if (key in digits) {
                    result = result.concat(`${digits[key]}`);
                    ii = kk;
                    break outer;
                }
            }
        }
    }
    reverse:
    for (let jj=line.length-1; jj>ii; jj--) {
        let token = line[jj];
        if (!isNaN(parseInt(token, 10))) {
            result = result.concat(token); // two or more digits
            break reverse;
        } else if (jj === ii + 1) {
            result = result.concat(result); // single digit is both first and last
        } else {
            let window = jj - lookAheadMin + 1;
            let stop = Math.max(ii, jj - lookAheadMax);
            for (let kk = window; kk > stop; kk--) {
                const key: string = line.slice(kk, jj+1);
                if (key in digits) {
                    result = result.concat(`${digits[key]}`);
                    break reverse;
                }
            }
        }
    }
    return parseInt(result, 10);
}

function main() {

    const test = [
        "two1nine",
        "eightwothree", 
        "abcone2threexyz",
        "xtwone3four",
        "4nineeightseven2",
        "zoneight234",
        "7pqrstsixteen",
    ];
    const testResult = test.map(recoverCode).filter(x => !isNaN(x));
    const testTotal = testResult.reduce((acc, cur) => acc + cur);
    const lines: string[] = readFileSync("./day-1.txt", { encoding: 'utf8', flag: 'r' }).split("\n");
    const result = lines.map(recoverCode).filter(x => !isNaN(x));
    const total = result.reduce((acc, cur) => acc + cur);

    console.log({
        result, 
        total,
        testResult,
        testTotal
    })
}

main()