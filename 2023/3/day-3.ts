type Interval = [number, number];
type Partition = [Interval[], Interval[]];
interface Scan {
    line: string
    numbers: Interval[]
    symbols: number[]
}

// Retrieve interval of all numerics
const numbers = (line: string): Interval[] => {
    const numberRegex = new RegExp("([1-9])([0-9]*)", "gi");
    return [...line.matchAll(numberRegex)].map(
        (item) => {
            let index = item.index as number;
            return [index, index + item[0].length - 1]
        }
    );
}

// Retrieve indexes of all symbols
const symbols = (line: string): number[] => {
    const symbolRegex = new RegExp("[^0-9\.]", "gi")
    return [...line.matchAll(symbolRegex)].flatMap(
        (item) => item.index as number
    );
}

// Separate some intervals by whether they intersect with a symbol
const partition = (numbers: Interval[], by_symbols: number[]) => {
    const intersects = ([start, end]: Interval) => 
        by_symbols.map((index: number) => index >= start - 1 && index <= end + 1);
    const reducer = ([pass, fail]: Partition, interval: Interval): Partition =>{
        const hits = intersects(interval);
        return hits.some(x => x) ? [[...pass, interval], fail] : [pass, [...fail, interval]];
    }
    return numbers.reduce(reducer, [[], []]);
}

// Convenience for parsing into final part numbers
const convert = (line: string) => 
    ([start, end]: Interval): number => {
        const substring = line.slice(start, end + 1);
        const numeric = parseInt(substring, 10);
        if (isNaN(numeric)) {
            console.log("invalid conversion", substring, "of", line);
        }
        return numeric;
    }

// Reduce boiler plate
const partitionWrapper = (source: Scan, symbols: number[]) => {
    let pass: Interval[];
    [pass, source.numbers] = partition(source.numbers, symbols);
    return pass.map(convert(source.line));
}

function main() {
    const lines: string = require("fs").readFileSync(
        "./day-3.txt", 
        {encoding: "utf8", flag: "r"}
    ).split("\n");

    let previous: Scan|undefined;
    let parts: number[] = [];

    for (let ii=0; ii<lines.length; ii++) {
        const current = {
            line: lines[ii],
            numbers: numbers(lines[ii]),
            symbols: symbols(lines[ii])
        };
        parts.push(...partitionWrapper(current, current.symbols));
        if (typeof previous !== "undefined") {
            parts.push(...partitionWrapper(current, previous.symbols));
            parts.push(...partitionWrapper(previous, current.symbols));
            if (ii === lines.length - 1) {
                parts.push(...current.numbers.map(convert(current.line)));
            }
        }
        previous = current;
    }
    console.log({
        parts,
        total: parts.reduce((acc, cur) => acc + cur)
    })
}

main()